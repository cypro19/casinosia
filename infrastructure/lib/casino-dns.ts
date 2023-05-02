import { Construct } from "constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as cdk from "aws-cdk-lib";

export type CasinoDnsProps = {
  domainName: string;
};

export class CasinoDns extends Construct {
  public readonly hostedZone: route53.HostedZone;

  constructor(scope: Construct, id: string, props: CasinoDnsProps) {
    super(scope, id);

    this.hostedZone = new route53.PublicHostedZone(this, "HostedZone", {
      zoneName: props.domainName,
    });

    this.hostedZone.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
  }
}
