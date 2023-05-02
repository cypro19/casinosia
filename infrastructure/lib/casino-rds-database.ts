import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secret from "aws-cdk-lib/aws-secretsmanager";

export type CasinoRdsDatabaseProps = {
  vpc: ec2.IVpc;
};

export class CasinoRdsDatabase extends Construct {
  public readonly credentials: secret.ISecret;
  public readonly port: number = 5432;

  constructor(scope: Construct, id: string, props: CasinoRdsDatabaseProps) {
    super(scope, id);

    const credentials = rds.Credentials.fromGeneratedSecret("casino", {
      secretName: "CasinoDbCredentials",
    });

    const secGroup = new ec2.SecurityGroup(this, "PostgresSecGroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
      securityGroupName: "PostgresSecGroup",
      description: "Rds Postgres cluster access",
    });

    // not really safe, should be in private network and utilize rds proxy
    secGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(this.port));

    const cluster = new rds.DatabaseCluster(this, "Database", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_14_6,
      }),
      instanceProps: {
        vpc: props.vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        securityGroups: [secGroup],
        // missing api: https://github.com/aws/aws-cdk/issues/20197
        instanceType: "serverless" as any as ec2.InstanceType,
        publiclyAccessible: true,
      },
      clusterIdentifier: "casino-database",
      credentials: credentials,
    });

    const cfnCluster: rds.CfnDBCluster = cluster.node.findChild(
      "Resource"
    ) as any;

    cfnCluster.serverlessV2ScalingConfiguration = {
      minCapacity: 0.5,
      maxCapacity: 4,
    };

    this.credentials = cluster.secret!;
  }
}
