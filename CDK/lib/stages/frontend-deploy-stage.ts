import {
    Stage, StageProps,
    aws_codepipeline_actions as actions,
    aws_codepipeline as codepipeline,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { IAction } from 'aws-cdk-lib/aws-codepipeline';
interface DeployStageProps extends StageProps {
    websiteBucket: IBucket;
}
export class DeployStage extends Stage {
    public readonly action: IAction
    constructor(scope: Construct, id: string, props: DeployStageProps) {
        super(scope, id, props);
        this.action = new actions.S3DeployAction({
            actionName: "deployStatic",
            bucket: props.websiteBucket,
            input: new codepipeline.Artifact("Build"),
        });
    }


}