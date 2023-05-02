import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as search from "aws-cdk-lib/aws-opensearchservice";
import * as secret from "aws-cdk-lib/aws-secretsmanager";

export type CasinoSearchProps = {
  vpc: ec2.IVpc;
};

export class CasinoSearch extends Construct {
  public readonly credentials: secret.ISecret;
  public readonly endpoint: string;

  private readonly searchDomain: search.Domain;
  private readonly searchPort: number = 9200;
  // opensearch port on which nodes talk to each other
  private readonly communicationPort: number = 9300;

  constructor(scope: Construct, id: string, props: CasinoSearchProps) {
    super(scope, id);

    // free tier - t2, t3 with small.search
    const freeTierInstanceType =
      ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL
      ).toString() + ".search";

    const secGroup = new ec2.SecurityGroup(this, "SearchSecGroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
      securityGroupName: "CasinoSearchSecGroup",
      description: "Provides public access for opensearch",
    });

    secGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(this.searchPort));
    secGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(this.communicationPort)
    );

    // first time deploying requires "es.amazonaws.com" service linked role
    // cloudformation does not create this role
    // aws iam create-service-linked-role --aws-service-name es.amazonaws.com
    // cannot be present in vpc public zone and have public ip
    this.searchDomain = new search.Domain(this, "PublicDomain", {
      version: search.EngineVersion.OPENSEARCH_2_3,
      useUnsignedBasicAuth: true,
      nodeToNodeEncryption: true,
      enableVersionUpgrade: true,
      encryptionAtRest: {
        enabled: true,
      },
      securityGroups: [secGroup],
      capacity: {
        dataNodes: 1,
        dataNodeInstanceType: freeTierInstanceType,
      },
      logging: {
        slowSearchLogEnabled: true,
        appLogEnabled: true,
        slowIndexLogEnabled: true,
      },
      enforceHttps: true,
      zoneAwareness: {
        availabilityZoneCount: 2,
        // enable for production
        enabled: false,
      },
    });

    this.endpoint = `https://${this.searchDomain.domainEndpoint}`;

    const masterUserSecret = this.searchDomain.node.findChild(
      "MasterUser"
    ) as secret.Secret;

    this.credentials = masterUserSecret;
  }
}
