import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as secret from "aws-cdk-lib/aws-secretsmanager";

import { NetworxAdminFrontendAssets } from "./networx-frontend";
import { InvalidateCache } from "../utils/cdn-invalidate-cache";
import { CasinoPlayerAccounts } from "../user-pools/casino-user-pool";

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
  // route53 public zone for
  hostedZone: route53.IHostedZone;
  // cognito props for player auth
  playerAccounts: CasinoPlayerAccounts;
};

export class NetworxAdminCloudfront extends Construct {
  constructor(scope: Construct, id: string, props: CdnProps) {
    super(scope, id);

    const adminAssets = new NetworxAdminFrontendAssets(this, "FrontendAssets", {
      bucketPostfix: props.assetPostfix,
    });

    // OAI deprecated, but there is no L2 constructs for OAC
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "AssetsOrigin",
      {
        comment: "Networx Admin Backend Api Assets",
      }
    );

    adminAssets.bucketPolicy.document.addStatements(
      new cdk.aws_iam.PolicyStatement({
        principals: [originAccessIdentity.grantPrincipal],
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${adminAssets.bucket.bucketArn}/*`],
      })
    );

    const adminAssetsOrigin = new origins.S3Origin(adminAssets.bucket, {
      originAccessIdentity: originAccessIdentity,
    });

    const cloudfrontFQDN = `nx.${props.hostedZone.zoneName}`;

    // no good alternative right now: https://github.com/aws/aws-cdk/pull/21982
    // this is what they offer: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_certificatemanager-readme.html#cross-region-certificates
    const certificate = new acm.DnsValidatedCertificate(
      this,
      "AdminCertificate",
      {
        domainName: cloudfrontFQDN,
        certificateName: "Networx Admin Cloudfront Certificate",
        region: "us-east-1",
        hostedZone: props.hostedZone,
      }
    );

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: { origin: adminAssetsOrigin },
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

    new InvalidateCache(this, "InvalidateCache", {
      distribution: distribution,
      invalidatePath: "/*",
      callerReference: adminAssets.assetsChecksum,
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
