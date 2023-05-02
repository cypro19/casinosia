import * as core from "aws-cdk-lib";
import { Construct } from "constructs";

export type InvalidateCacheProps = {
  distribution: core.aws_cloudfront.Distribution;
  invalidatePath?: string;
  callerReference: string;
};

export class InvalidateCache extends Construct {
  constructor(scope: Construct, id: string, props: InvalidateCacheProps) {
    super(scope, id);

    const invalidatePath = props.invalidatePath ?? "/*";

    const policy = core.custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
      resources: core.custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE,
    });

    const invalidateRequest = new core.custom_resources.AwsCustomResource(
      scope,
      "Resource",
      {
        policy: policy,
        onUpdate: {
          action: "createInvalidation",
          service: "CloudFront",
          parameters: {
            DistributionId: props.distribution.distributionId,
            InvalidationBatch: {
              CallerReference: props.callerReference,
              Paths: {
                Quantity: "1",
                Items: [invalidatePath],
              },
            },
          },
          physicalResourceId: core.custom_resources.PhysicalResourceId.of(
            `${props.distribution.domainName}Invalidation`
          ),
        },
        onCreate: {
          action: "createInvalidation",
          service: "CloudFront",
          parameters: {
            DistributionId: props.distribution.distributionId,
            InvalidationBatch: {
              CallerReference: props.callerReference,
              Paths: {
                Quantity: "1",
                Items: [invalidatePath],
              },
            },
          },
          physicalResourceId: core.custom_resources.PhysicalResourceId.of(
            `${props.distribution.domainName}Invalidation`
          ),
        },
      }
    );

    invalidateRequest.node.addDependency(props.distribution);
  }
}
