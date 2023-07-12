import {
    Stage, StageProps,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';
import { IAction } from 'aws-cdk-lib/aws-codepipeline';

export class SelfMutateStage extends Stage {
    public readonly action: IAction
    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props);

    }


}