import * as path from "path";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export type ImageOptimizationLambdaProps = {};

export class ImageOptimizationLambda extends Construct {
  public readonly func: lambda.Function;

  constructor(
    scope: Construct,
    id: string,
    props: ImageOptimizationLambdaProps
  ) {
    super(scope, id);

    const rootDir = this.node.tryGetContext("project:rootDir");
    const nxCasinoFrontendPath = path.join(rootDir, "nx-casino-frontend");

    const code = lambda.Code.fromDockerBuild(nxCasinoFrontendPath, {
      targetStage: "open-next-image-optimization-function",
      platform: "linux/amd64",
      imagePath: "/image-optimization-function",
    });

    this.func = new lambda.Function(this, "Function", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "index.handler",
      code: code,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 2048,
    });
  }
}
