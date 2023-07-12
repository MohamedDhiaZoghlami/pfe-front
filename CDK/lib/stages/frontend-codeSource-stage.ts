import {
    Stage, StageProps,
    aws_codepipeline_actions as actions,
    aws_codepipeline as codepipeline,
    SecretValue as sv,
    aws_ssm as ssm
} from 'aws-cdk-lib';

import { Construct } from 'constructs';

import { IAction } from 'aws-cdk-lib/aws-codepipeline';

interface CodeSourceStageProps extends StageProps {
    githubToken: string
}
export class CodeSourceStage extends Stage {
    public readonly action: IAction
    constructor(scope: Construct, id: string, props: CodeSourceStageProps) {
        super(scope, id, props);
        this.action = new actions.GitHubSourceAction({
            owner: "MohamedDhiaZoghlami",
            actionName: "sourceFromCodeCommit",
            output: new codepipeline.Artifact("Source"),
            branch: 'main',
            repo: "pfe-front",
            oauthToken: sv.unsafePlainText(props.githubToken),
            trigger: actions.GitHubTrigger.WEBHOOK
        });
    }


}