import {
  Stack, StackProps,
  aws_codepipeline as codepipeline,
  aws_codebuild as codebuild,
  aws_ssm as ssm,

} from 'aws-cdk-lib';

import { Construct } from 'constructs';
import { IBucket } from 'aws-cdk-lib/aws-s3';

import { CodeSourceStage } from './stages/frontend-codeSource-stage';
import { BuildStage } from './stages/frontend-build-stage';
import { DeployStage } from './stages/frontend-deploy-stage';
import { BuildEnvironmentVariableType, Cache, LocalCacheMode } from 'aws-cdk-lib/aws-codebuild';


interface CRMFrontendPipelineStackProps extends StackProps {
  websiteBucket: IBucket;
}
export class CRMFrontendPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: CRMFrontendPipelineStackProps) {
    super(scope, id, props);

    const CRM_ASSETS_BUCKET_NAME = ssm.StringParameter.fromStringParameterAttributes(
      this,
      `CRM_ASSETS_BUCKET_NAME`,
      { parameterName: "/CRM/buckets/assets_bucket_name" }
    ).stringValue;

    const CRM_ASSETS_DISTRIBUTION_DOMAIN = ssm.StringParameter.fromStringParameterAttributes(
      this,
      `CRM_ASSETS_DISTRIBUTION_DOMAIN`,
      { parameterName: "/CRM/distributions/assets_distribution_domain_name" }
    ).stringValue;
    // const CRM_API_BACKEND = ssm.StringParameter.fromStringParameterAttributes(
    //   this,
    //   'CRM_API_BACKEND',
    //   { parameterName: "/CRM/backend/api_url" }
    // ).stringValue

    const codeBuildProject = new codebuild.PipelineProject(this, "CodeBuildProject", {
      projectName: `CRM_BUILD_PROJECT`,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL,
      },
      cache: Cache.local(LocalCacheMode.DOCKER_LAYER),
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            "runtime-versions": { nodejs: 18 },
            commands: ["cd CRM", "npm install --legacy-peer-deps"],
          },
          build: {
            commands: [
              'echo "pass envirement variables on `date`"',
              'echo "REACT_APP_REGION=$REGION" >> .env',
              // 'echo "REACT_APP_CRM_API_BACKEND=$REACT_APP_CRM_API_BACKEND" >> .env',
              'echo "REACT_APP_CRM_ASSETS_BUCKET_NAME=$REACT_APP_CRM_ASSETS_BUCKET_NAME" >> .env',
              'echo "REACT_APP_CRM_ASSETS_DISTRIBUTION_DOMAIN=$REACT_APP_CRM_ASSETS_DISTRIBUTION_DOMAIN" >> .env',
              'echo "Build started on `date`"',
              "npm run build",
              'echo "Build finished on `date`"',
            ],
          },
        },

        artifacts: {
          name: "BuildOutput",
          files: ["**/*"],
          "base-directory": "build",
        },
      }),
      environmentVariables: {
        REACT_APP_CRM_ASSETS_BUCKET_NAME: { type: BuildEnvironmentVariableType.PLAINTEXT, value: CRM_ASSETS_BUCKET_NAME },
        REACT_APP_REGION: { type: BuildEnvironmentVariableType.PLAINTEXT, value: this.region },
        // REACT_APP_CRM_API_BACKEND: { type: BuildEnvironmentVariableType.PLAINTEXT, value: CRM_API_BACKEND },
        REACT_APP_CRM_ASSETS_DISTRIBUTION_DOMAIN: { type: BuildEnvironmentVariableType.PLAINTEXT, value: CRM_ASSETS_DISTRIBUTION_DOMAIN },
      },
    });
    const githubToken = ssm.StringParameter.fromStringParameterAttributes(
      this,
      `CRM_Github_Token`,
      { parameterName: "/CRM/github/accessToken" }
    ).stringValue;

    new codepipeline.Pipeline(this, "CRM-Frontend-pipeline", {
      crossAccountKeys: false,
      pipelineName: `CRM_FRONTEND_PIPELINE`,
      stages: [
        {
          stageName: "source",
          actions: [new CodeSourceStage(this, "sourceStage", { githubToken }).action]
        },
        {
          stageName: "build",
          actions: [
            new BuildStage(this, "buildStage", {
              codeBuildProject: codeBuildProject
            }).action]
        },
        {
          stageName: "deploy",
          actions: [
            new DeployStage(this, "deployStage", {
              websiteBucket: props.websiteBucket
            }).action
          ]
        }

      ]
    });
  }
}
