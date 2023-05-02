import * as path from "path";
import * as secret from "aws-cdk-lib/aws-secretsmanager";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { CasinoPlayerAccounts } from "../../user-pools/casino-user-pool";
import { Construct } from "constructs";

export type ServerLambdaProps = {
  // secret for rds containing credentials
  dbCredentials: secret.ISecret;
  // shared service database name used by casino apps
  dbName: string;
  // cognito props for player auth
  playerAccounts: CasinoPlayerAccounts;
  // how api will be accessed
  fullyQualifiedDomainName: string;
};

export class ServerLambda extends Construct {
  public readonly func: lambda.Function;

  constructor(scope: Construct, id: string, props: ServerLambdaProps) {
    super(scope, id);

    const rootDir = this.node.tryGetContext("project:rootDir");
    const nxCasinoFrontendPath = path.join(rootDir, "nx-casino-frontend");

    const code = lambda.Code.fromDockerBuild(nxCasinoFrontendPath, {
      targetStage: "open-next-server-lambda",
      platform: "linux/amd64",
      imagePath: "/server-function",
    });

    this.func = new lambda.Function(this, "Function", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "index.handler",
      code: code,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 2048,
      environment: {
        COGNITO_CLIENT_ID: props.playerAccounts.authClient.userPoolClientId,
        COGNITO_USER_POOL_ID: props.playerAccounts.userPool.userPoolId,
        COGNITO_REGION: props.playerAccounts.region,
        DB_SECRET_NAME: props.dbCredentials.secretName!,
        DATABASE_NAME: props.dbName,
        OPEN_NEXT_REQ_BASE_URL: `https://${props.fullyQualifiedDomainName}`,
      },
    });

    props.dbCredentials.grantRead(this.func);

    props.playerAccounts.userPool.grant(
      this.func,
      ...[
        "cognito-idp:AdminCreateUser",
        "cognito-idp:SignUp",
        "cognito-idp:ConfirmSignUp",
        "cognito-idp:AdminSetUserPassword",
        "cognito-idp:AdminInitiateAuth",
        "cognito-idp:AdminGetUserCommand",
      ]
    );
  }
}
