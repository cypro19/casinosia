import { Construct } from "constructs";
import * as path from "path";
import * as crypto from "node:crypto";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cdk from "aws-cdk-lib";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import * as lambda from "aws-cdk-lib/aws-lambda";

export type NetworxAdminFrontendAssetsProps = {
  // buckets must have globally unique names
  bucketPostfix: string;
};

export class NetworxAdminFrontendAssets extends Construct {
  public readonly bucket: s3.IBucket;
  public readonly bucketPolicy: s3.BucketPolicy;
  public readonly assetsChecksum: string;

  constructor(
    scope: Construct,
    id: string,
    props: NetworxAdminFrontendAssetsProps
  ) {
    super(scope, id);

    const rootDir = this.node.tryGetContext("project:rootDir");
    const gsAdminDockerContext = path.join(rootDir, "management-frontend");

    this.bucket = new s3.Bucket(this, "Bucket", {
      bucketName: `management-frontend-${props.bucketPostfix}`,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // TODO: requires side effect to work
    // don't define bucket policy unless statement is added otherwise error will be thrown
    this.bucketPolicy = new cdk.aws_s3.BucketPolicy(this, "BucketPolicy", {
      bucket: this.bucket,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const code = lambda.Code.fromDockerBuild(gsAdminDockerContext, {
      targetStage: "builder",
      platform: "linux/amd64",
      imagePath: "/management-frontend/dist",
    });

    // when deploying using bucket file path contains checksum from build
    this.assetsChecksum = crypto
      .createHash("md5")
      .update(code.path)
      .digest("hex");

    new cdk.aws_s3_deployment.BucketDeployment(this, "AssetsDeployment", {
      sources: [s3Deploy.Source.asset(code.path)],
      destinationBucket: this.bucket,
      memoryLimit: 512,
    });
  }
}
