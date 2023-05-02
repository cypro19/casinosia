import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

type CasinoPlayerAccountsProps = {
  domainName: string;
};

export class CasinoPlayerAccounts extends Construct {
  public readonly userPool: cognito.IUserPool;
  public readonly authClient: cognito.UserPoolClient;
  public readonly region = "eu-central-1";

  constructor(scope: Construct, id: string, props: CasinoPlayerAccountsProps) {
    super(scope, id);

    this.userPool = new cognito.UserPool(this, "UserPool", {
      email: cognito.UserPoolEmail.withSES({
        fromEmail: `registration@${props.domainName}`,
        sesRegion: this.region,
        sesVerifiedDomain: props.domainName,
      }),
      autoVerify: {
        email: true,
      },
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Hello from networx",
        emailBody: "Confirmation code {####}",
      },
    });

    this.authClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool: this.userPool,
      authFlows: {
        adminUserPassword: true,
      },
    });
  }
}
