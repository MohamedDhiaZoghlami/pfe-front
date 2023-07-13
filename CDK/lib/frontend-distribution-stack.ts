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
            bucketName: `crm-frontend-website`,
            accessControl: s3.BucketAccessControl.PRIVATE,
            publicReadAccess: false,
            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: false,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "index.html",
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        const oin = new cloudfront.OriginAccessIdentity(this, 'CRM-Website-origin-access-identity', {
            comment: "Origin identity for CRM Website"
        });

        this.websiteBucket.grantRead(oin);
        const distribution = new cloudfront.Distribution(this, `CRM-website-Distribution`, {
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            comment: `CRM Website Distribution`,
            defaultBehavior: {
                origin: new origins.S3Origin(this.websiteBucket, { originAccessIdentity: oin }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
            },
            enabled: true
        });



    }


}
