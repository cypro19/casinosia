import { Construct } from "constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import { CasinoFrontendStaticAssets } from "./casino-frontend/casino-static-assets";
import { ImageOptimizationLambda } from "./casino-frontend/image-optimization-lambda";
import { ServerLambda } from "./casino-frontend/server-lambda";
import { CasinoFrontendCloudfront } from "./casino-frontend/casino-frontend-cloudfront";

import * as secret from "aws-cdk-lib/aws-secretsmanager";
import { CasinoPlayerAccounts } from "../user-pools/casino-user-pool";

export type NetworxCasinoAppProps = {
  bucketPostfix: string;
  // secret manager for rds
  dbCredentials: secret.ISecret;
  // database name for casino service
  dbName: string;
  // route53 public zone for
  hostedZone: route53.IHostedZone;
  // cognito props for player auth
  playerAccounts: CasinoPlayerAccounts;
};

export class NetworxCasinoApp extends Construct {
  constructor(scope: Construct, id: string, props: NetworxCasinoAppProps) {
    super(scope, id);

    const fullyQualifiedDomainName = `casino.${props.hostedZone.zoneName}`;

    const staticAssets = new CasinoFrontendStaticAssets(this, "StaticAssets", {
      bucketPostfix: props.bucketPostfix,
    });

    const imageOptLambda = new ImageOptimizationLambda(
      this,
      "ImageOptimizationLambda",
      {}
    );

    const serverLambda = new ServerLambda(this, "ServerLambda", {
      playerAccounts: props.playerAccounts,
      dbCredentials: props.dbCredentials,
      dbName: props.dbName,
      fullyQualifiedDomainName: fullyQualifiedDomainName,
    });

    const cloudfront = new CasinoFrontendCloudfront(this, "Cloudfront", {
      imageOptimizationLambda: imageOptLambda,
      serverLambda: serverLambda,
      staticAssets: staticAssets,
      hostedZone: props.hostedZone,
      fullyQualifiedDomainName: fullyQualifiedDomainName,
    });
  }
}
