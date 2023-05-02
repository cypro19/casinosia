import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export type InfraVpcProps = {};

export class NetworXCasinoVpc extends Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props?: InfraVpcProps) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, "Vpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.16.0.0/16"),
      // subnets only in 2 AZs since account not specified
      maxAzs: 2,
      vpcName: "NetworxCasinoVpc",
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "application-subnet",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "private-subnet",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          reserved: true,
          name: "reserved-subnet",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
  }
}
