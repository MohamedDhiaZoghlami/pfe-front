import {
    Stage, StageProps,
    aws_codepipeline_actions as actions,
    aws_codepipeline as codepipeline,
    SecretValue as sv
} from 'aws-cdk-lib';

import { Construct } from 'constructs';

import { IAction } from 'aws-cdk-lib/aws-codepipeline';

export class CodeSourceStage extends Stage {
    public readonly action: IAction
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);
        this.action = new actions.GitHubSourceAction({
            owner: "MohamedDhiaZoghlami",
            actionName: "sourceFromCodeCommit",
            output: new codepipeline.Artifact("Source"),
            branch: 'main',
            repo: "pfe-front",
            oauthToken: sv.unsafePlainText("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"),
            trigger: actions.GitHubTrigger.WEBHOOK
        });
    }


}