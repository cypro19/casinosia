import start from "./app";
import * as express from "./express";
import logger from "../app/common/logger";
import { elasticClient } from "./elasticClient";

const app = { start };
export { express, app, elasticClient, logger };
