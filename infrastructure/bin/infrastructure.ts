#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { InfrastructureStack } from "../lib/infrastructure-stack";

const app = new cdk.App();
new InfrastructureStack(app, "InfrastructureStack", {
  env: {
    account: "590801008124",
    region: "eu-central-1",
  },
});
