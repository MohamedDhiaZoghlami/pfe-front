import {
    Stage, StageProps,
    aws_codepipeline_actions as actions,
    aws_codepipeline as codepipeline,
    SecretValue as sv,
    aws_ssm as ssm
} from 'aws-cdk-lib';

import { Construct } from 'constructs';

import { IAction } from 'aws-cdk-lib/aws-codepipeline';

export class CodeSourceStage extends Stage {
    public readonly action: IAction
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);
        const githubToken = ssm.StringParameter.fromStringParameterAttributes(
            this,
            `CRM_Github_Token`,
            { parameterName: "/CRM/github/accessToken" }
        ).stringValue;
        this.action = new actions.GitHubSourceAction({
            owner: "MohamedDhiaZoghlami",
            actionName: "sourceFromCodeCommit",
            output: new codepipeline.Artifact("Source"),
            branch: 'main',
            repo: "pfe-front",
            oauthToken: sv.unsafePlainText(githubToken),
            trigger: actions.GitHubTrigger.WEBHOOK
        });
    }


}