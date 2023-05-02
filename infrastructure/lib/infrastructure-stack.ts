import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { GsAdminCloudfront } from "./gamma-stack/gs-admin-cloudfront";
import { NetworXCasinoVpc } from "./casino-vpc";
import { CasinoRdsDatabase } from "./casino-rds-database";
import { CasinoDns } from "./casino-dns";
import { CasinoSearch } from "./casino-search-database";
import { NetworxAdminCloudfront } from "./networx-stack/networx-cloudfront";
import { CasinoPlayerAccounts } from "./user-pools/casino-user-pool";
import { NetworxCasinoApp } from "./networx-stack/networx-casino-app";
import { EmailService } from "./user-pools/email-service";

const assetPrefix = "dev";
const domainName = "dev.networx.services";

const casinoDbName = "casino_060323";

const bucketPostfix = "open-next";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rootDir = path.resolve(__dirname, "..", "..");
    this.node.setContext("project:rootDir", rootDir);

    const casinoVpc = new NetworXCasinoVpc(this, "vpc");
    const casinoDns = new CasinoDns(this, "dns", {
      domainName: domainName,
    });

    const emailService = new EmailService(this, "EmailService", {
      domainName: domainName,
      hostedZone: casinoDns.hostedZone,
    });

    const playerAccounts = new CasinoPlayerAccounts(this, "CasinoUsers", {
      domainName: domainName,
    });

    const rds = new CasinoRdsDatabase(this, "database", {
      vpc: casinoVpc.vpc,
    });

    const search = new CasinoSearch(this, "search", {
      vpc: casinoVpc.vpc,
    });

    const gsCloudfront = new GsAdminCloudfront(this, "GsCdn", {
      assetPostfix: assetPrefix,
      dbCredentials: rds.credentials,
      dbName: casinoDbName,
      searchCredentials: search.credentials,
      searchEndpoint: search.endpoint,
      hostedZone: casinoDns.hostedZone,
    });

    gsCloudfront.node.addDependency(casinoDns);

    const nxCloudfront = new NetworxAdminCloudfront(this, "NxCdn", {
      assetPostfix: assetPrefix,
      dbCredentials: rds.credentials,
      dbName: casinoDbName,
      searchCredentials: search.credentials,
      searchEndpoint: search.endpoint,
      hostedZone: casinoDns.hostedZone,
      playerAccounts: playerAccounts,
    });

    nxCloudfront.node.addDependency(casinoDns);

    new NetworxCasinoApp(this, "NxCasino", {
      bucketPostfix: bucketPostfix,
      hostedZone: casinoDns.hostedZone,
      dbCredentials: rds.credentials,
      dbName: casinoDbName,
      playerAccounts: playerAccounts,
    });
  }
}
