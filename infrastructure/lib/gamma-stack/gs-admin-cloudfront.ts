import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as secret from "aws-cdk-lib/aws-secretsmanager";

import { GsAdminFrontendAssets } from "./gs-admin-frontend";
import { GsAdminBackend } from "./gs-admin-backend";
import { InvalidateCache } from "../utils/cdn-invalidate-cache";

export type CdnProps = {
  // buckets must have globally unique names
  assetPostfix: string;
  // secret manager for rds
  dbCredentials: secret.ISecret;
  // database name for casino service
  dbName: string;
  // contains username and password for opensearch
  searchCredentials: secret.ISecret;
  // http url for opensearch endpoint
  searchEndpoint: string;
  // route53 public zone for gs
  hostedZone: route53.IHostedZone;
};

export class GsAdminCloudfront extends Construct {
  constructor(scope: Construct, id: string, props: CdnProps) {
    super(scope, id);

    const gsAdminAssets = new GsAdminFrontendAssets(this, "FrontendAssets", {
      bucketPostfix: props.assetPostfix,
    });

    const gsAdminBackend = new GsAdminBackend(this, "GsAdminBacked", {
      dbCredentials: props.dbCredentials,
      searchCredentials: props.searchCredentials,
      searchEndpoint: props.searchEndpoint,
      hostedZone: props.hostedZone,
      mainSubdomain: "gs-api",
      alternativeSubdomains: ["gs"],
      dbName: props.dbName,
    });

    // OAI deprecated, but there is no L2 constructs for OAC
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "AssetsOrigin",
      {
        comment: "Gamma Stack Admin Backend Api Assets",
      }
    );

    gsAdminAssets.bucketPolicy.document.addStatements(
      new cdk.aws_iam.PolicyStatement({
        principals: [originAccessIdentity.grantPrincipal],
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${gsAdminAssets.bucket.bucketArn}/*`],
      })
    );

    const gsAdminAssetsOrigin = new origins.S3Origin(gsAdminAssets.bucket, {
      originAccessIdentity: originAccessIdentity,
    });

    const cloudfrontFQDN = `gs.${props.hostedZone.zoneName}`;

    // no good alternative right now: https://github.com/aws/aws-cdk/pull/21982
    // this is what they offer: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_certificatemanager-readme.html#cross-region-certificates
    const certificate = new acm.DnsValidatedCertificate(
      this,
      "GsAdminCertificate",
      {
        domainName: cloudfrontFQDN,
        certificateName: "GS Admin Cloudfront Certificate",
        region: "us-east-1",
        hostedZone: props.hostedZone,
      }
    );

    // any can be removed once https://github.com/aws/aws-cdk/pull/24023 is fixed
    const gsAdminBackendOrigin = new origins.RestApiOrigin(gsAdminBackend.api, {
      originPath: "/",
    } as any as cloudfront.OriginOptions);

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: { origin: gsAdminAssetsOrigin },
      defaultRootObject: "/index.html",
      certificate: certificate,
      domainNames: [cloudfrontFQDN],
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    distribution.addBehavior("/api/*", gsAdminBackendOrigin, {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    });

    new InvalidateCache(this, "InvalidateCache", {
      distribution: distribution,
      invalidatePath: "/*",
      callerReference: gsAdminAssets.assetsChecksum,
    });

    new route53.ARecord(this, "ApiARecord", {
      zone: props.hostedZone,
      recordName: cloudfrontFQDN,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });

    new route53.AaaaRecord(this, "ApiAaaaRecord", {
      zone: props.hostedZone,
      recordName: cloudfrontFQDN,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });
  }
}
