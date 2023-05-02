import { Construct } from "constructs";
import * as ses from "aws-cdk-lib/aws-ses";
import * as route53 from "aws-cdk-lib/aws-route53";

type EmailServiceProps = {
  domainName: string;
  hostedZone: route53.HostedZone;
};

export class EmailService extends Construct {
  constructor(scope: Construct, id: string, props: EmailServiceProps) {
    super(scope, id);

    const identity = new ses.EmailIdentity(this, "Identity", {
      identity: ses.Identity.publicHostedZone(props.hostedZone),
    });
  }
}
