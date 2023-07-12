import {
    CfnOutput,
    Stack, StackProps,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    RemovalPolicy

} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IBucket } from 'aws-cdk-lib/aws-s3';

export class WebsiteDistributionStack extends Stack {
    public readonly websiteBucket: IBucket
    public readonly distribution: cloudfront.IDistribution

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.websiteBucket = new s3.Bucket(this, "websiteBucket", {
            bucketName: `frontend-crm-website`,
            accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
            publicReadAccess: true,
            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: false,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "index.html",
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: new s3.BlockPublicAccess({
                blockPublicAcls: false,
                ignorePublicAcls: false,
                blockPublicPolicy: false,
                restrictPublicBuckets: false,
            }),
        });

        const distribution = new cloudfront.Distribution(this, `CRM-website-Distribution`, {
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            comment: `CRM Website Distribution`,
            defaultBehavior: {
                origin: new origins.S3Origin(this.websiteBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
            },
            enabled: true
        });


        new CfnOutput(this, "distribution-CRM-frontend", {
            value: distribution.distributionDomainName,
        });

    }


}
