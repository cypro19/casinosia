import { Construct } from "constructs";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as secret from "aws-cdk-lib/aws-secretsmanager";

export type GsAdminBackendProps = {
  // secret for rds containing credentials
  dbCredentials: secret.ISecret;
  // database name for casino service
  dbName: string;
  // contains username and password for opensearch
  searchCredentials: secret.ISecret;
  // https endpoint for opensearch
  searchEndpoint: string;
  // zone in which to put dns records
  hostedZone: route53.IHostedZone;
  // creates A and AAAA records
  mainSubdomain: string;
  // does not create dns records
  alternativeSubdomains: string[];
};

export class GsAdminBackend extends Construct {
  public readonly api: apigateway.LambdaRestApi;

  constructor(scope: Construct, id: string, props: GsAdminBackendProps) {
    super(scope, id);

    const rootDir = this.node.tryGetContext("project:rootDir");
    const gsAdminDockerContext = path.join(rootDir, "gs-admin-backend");

    const code = lambda.Code.fromDockerBuild(gsAdminDockerContext, {
      targetStage: "builder",
      platform: "linux/amd64",
      imagePath: "/gs-admin-backend/dist",
    });

    const func = new lambda.Function(this, "Function", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "lambda.handler",
      code: code,
      memorySize: 2048,
      environment: {
        DB_NAME: props.dbName,
        DB_SYNC: "false",
        NODE_ENV: "development",
        DB_SECRET_NAME: props.dbCredentials.secretName!,
        SEARCH_SECRET_NAME: props.searchCredentials.secretName!,
        SEARCH_ENDPOINT: props.searchEndpoint,
        WINDOW_AGE: "300000",
        SECRET_KEY: "glpat-Dg6DWhJbVoWMqydy-vSU",
        JWT_LOGIN_SECRET: "test-secret",
        JWT_LOGIN_TOKEN_EXPIRY: "2d",
        WEB_APP_BASE_URL: "http://localhost:3000",
        CREDENTIAL_ENCRYPTION_KEY: "test",
      },
    });

    props.dbCredentials.grantRead(func);
    props.searchCredentials.grantRead(func);

    const FQDN = `${props.mainSubdomain}.${props.hostedZone.zoneName}`;

    const alternativeFQDN = props.alternativeSubdomains.map(
      (subdomain) => `${subdomain}.${props.hostedZone.zoneName}`
    );

    const certificate = new acm.Certificate(this, "GsAdminCertificate", {
      domainName: FQDN,
      certificateName: "GS Admin Backend API Certificate",
      validation: acm.CertificateValidation.fromDns(props.hostedZone),
      subjectAlternativeNames: alternativeFQDN,
    });

    this.api = new apigateway.LambdaRestApi(this, "RestApi", {
      handler: func,
      proxy: true,
      domainName: {
        certificate: certificate,
        domainName: FQDN,
      },
      restApiName: "GammaStackAdminBackend",
      endpointTypes: [apigateway.EndpointType.REGIONAL],
    });

    this.api.node.addDependency(certificate);

    alternativeFQDN.forEach((name) => {
      this.api.addDomainName(name, {
        domainName: name,
        certificate: certificate,
      });
    });

    new route53.ARecord(this, "ApiARecord", {
      zone: props.hostedZone,
      recordName: FQDN,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(this.api)),
    });

    new route53.AaaaRecord(this, "ApiAaaaRecord", {
      zone: props.hostedZone,
      recordName: FQDN,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(this.api)),
    });
  }
}
