#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CRMStorageStack } from '../lib/CRM-storage-stack';
import { WebsiteDistributionStack } from '../lib/frontend-distribution-stack';
import { CRMFrontendPipelineStack } from '../lib/frontend-pipeline-stack';

const app = new cdk.App();

new CRMStorageStack(app, "CRM-storage-stack");

const websiteDistribution = new WebsiteDistributionStack(app, "CRM-WebsiteDistribution-Stack");

new CRMFrontendPipelineStack(app, "CRM-Frontend-Pipeline-Stack", {
    websiteBucket: websiteDistribution.websiteBucket
});