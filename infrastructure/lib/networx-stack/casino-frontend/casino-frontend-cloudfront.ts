import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cdk from "aws-cdk-lib";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import { CasinoFrontendStaticAssets } from "./casino-static-assets";
import { ImageOptimizationLambda } from "./image-optimization-lambda";
import { ServerLambda } from "./server-lambda";
import { InvalidateCache } from "../../utils/cdn-invalidate-cache";

export type CasinoFrontendCloudfrontProps = {
  serverLambda: ServerLambda;
  imageOptimizationLambda: ImageOptimizationLambda;
  staticAssets: CasinoFrontendStaticAssets;
  // route53 public zone for
  hostedZone: route53.IHostedZone;
  // how api will be accessed
  fullyQualifiedDomainName: string;
};

export class CasinoFrontendCloudfront extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: CasinoFrontendCloudfrontProps
  ) {
    super(scope, id);

    // no good alternative right now: https://github.com/aws/aws-cdk/pull/21982
    // this is what they offer: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_certificatemanager-readme.html#cross-region-certificates
    const certificate = new acm.DnsValidatedCertificate(
      this,
      "AdminCertificate",
      {
        domainName: props.fullyQualifiedDomainName,
        certificateName: "Networx Casino Admin Cloudfront Certificate",
        region: "us-east-1",
        hostedZone: props.hostedZone,
      }
    );

    const serverBehavior = this.createServerBehavior(props);
    const staticFileBehavior = this.createStaticAssetsBehavior(props);
    const imageBehavior = this.createImageOptimizationBehavior(props);

    const fallbackOriginGroup = new origins.OriginGroup({
      primaryOrigin: serverBehavior.origin,
      fallbackOrigin: staticFileBehavior.origin,
      fallbackStatusCodes: [404],
    });

    const defaultBehavior = {
      origin: fallbackOriginGroup,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      compress: true,
      cachePolicy: serverBehavior.cachePolicy,
      edgeLambdas: serverBehavior.edgeLambdas,
    };

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      domainNames: [props.fullyQualifiedDomainName],
      certificate: certificate,
      defaultBehavior: defaultBehavior,
      errorResponses: [
        {
          // object not found in the bucket, when fallback behavior
          httpStatus: 403,
          responseHttpStatus: 404,
          // TODO: there is no dedicated "not found" page
          responsePagePath: "/",
        },
      ],
      additionalBehaviors: {
        "api/*": serverBehavior,
        "_next/data/*": serverBehavior,
        "_next/image*": imageBehavior,
        "_next/*": staticFileBehavior,
      },
    });

    new InvalidateCache(this, "InvalidateCache", {
      distribution: distribution,
      invalidatePath: "/*",
      callerReference: `${Date.now()}`,
    });

    new route53.ARecord(this, "ApiARecord", {
      zone: props.hostedZone,
      recordName: props.fullyQualifiedDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    new route53.AaaaRecord(this, "ApiAaaaRecord", {
      zone: props.hostedZone,
      recordName: props.fullyQualifiedDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });
  }

  private createStaticAssetsBehavior(
    props: CasinoFrontendCloudfrontProps
  ): cloudfront.BehaviorOptions {
    // OAI deprecated, but there is no L2 constructs for OAC
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "AssetsOrigin",
      {
        comment: "Networx Casino assets for open next",
      }
    );

    props.staticAssets.bucketPolicy.document.addStatements(
      new cdk.aws_iam.PolicyStatement({
        principals: [originAccessIdentity.grantPrincipal],
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${props.staticAssets.bucket.bucketArn}/*`],
      })
    );

    const adminAssetsOrigin = new origins.S3Origin(props.staticAssets.bucket, {
      originAccessIdentity: originAccessIdentity,
    });

    return {
      origin: adminAssetsOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    };
  }

  private createServerBehavior(
    props: CasinoFrontendCloudfrontProps
  ): cloudfront.BehaviorOptions {
    const serverLambdaUrl = props.serverLambda.func.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    const cachePolicy = new cloudfront.CachePolicy(this, "ServerCache", {
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
        // required by image optimization request
        "accept",
        // required by server request
        "x-op-middleware-request-headers",
        "x-op-middleware-response-headers",
        "x-nextjs-data",
        "x-middleware-prefetch",
        // required by server request (in-place routing)
        "rsc",
        "next-router-prefetch",
        "next-router-state-tree"
      ),
      cookieBehavior: cloudfront.CacheCookieBehavior.all(),
      defaultTtl: cdk.Duration.days(0),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.days(0),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
      comment: "Server response cache policy",
    });

    return {
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      origin: new origins.HttpOrigin(
        cdk.Fn.parseDomainName(serverLambdaUrl.url)
      ),
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
      cachePolicy: cachePolicy,
      // TODO: add middleware
      // https://github.com/serverless-stack/sst/blob/master/packages/sst/src/constructs/NextjsSite.ts
    };
  }

  private createImageOptimizationBehavior(
    props: CasinoFrontendCloudfrontProps
  ): cloudfront.BehaviorOptions {
    const lambdaUrl = props.imageOptimizationLambda.func.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    props.imageOptimizationLambda.func.addEnvironment(
      "BUCKET_NAME",
      props.staticAssets.bucket.bucketName
    );

    props.staticAssets.bucket.grantRead(props.imageOptimizationLambda.func);

    const imageCache = new cloudfront.CachePolicy(this, "ImageCache", {
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
        // required by image optimization request
        "accept",
        // required by server request
        "x-op-middleware-request-headers",
        "x-op-middleware-response-headers",
        "x-nextjs-data",
        "x-middleware-prefetch",
        // required by server request (in-place routing)
        "rsc",
        "next-router-prefetch",
        "next-router-state-tree"
      ),
      cookieBehavior: cloudfront.CacheCookieBehavior.all(),
      defaultTtl: cdk.Duration.days(0),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.days(0),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
      comment: "Server response image optimization cache policy",
    });

    return {
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      origin: new origins.HttpOrigin(cdk.Fn.parseDomainName(lambdaUrl.url)),
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
      cachePolicy: imageCache,
    };
  }
}
