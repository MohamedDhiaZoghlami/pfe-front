import {
    Stack, StackProps,
    aws_s3 as s3,
    RemovalPolicy,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CRMStorageStack extends Stack {
    public readonly objectBucket: s3.IBucket;
    public readonly distribution: cloudfront.IDistribution

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.objectBucket = new s3.Bucket(this, "CRM-Object-Bucket", {
            accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: false,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            cors: [
                {
                    allowedHeaders: [
                        "*"
                    ],
                    allowedMethods: [
                        s3.HttpMethods.GET, s3.HttpMethods.HEAD,
                        s3.HttpMethods.PUT, s3.HttpMethods.POST,
                        s3.HttpMethods.DELETE, s3.HttpMethods.DELETE
                    ],
                    allowedOrigins: ["*"],
                    exposedHeaders: [
                        "x-amz-server-side-encryption",
                        "x-amz-request-id",
                        "x-amz-id-2",
                        "ETag"
                    ],
                    maxAge: 3000
                }
            ]
        });
        this.distribution = new cloudfront.Distribution(this, `CRM-Assets-Distribution`, {
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            comment: `CRM Assets Distribution`,
            defaultBehavior: {
                origin: new origins.S3Origin(this.objectBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
            },
            enabled: true
        });


    }
}
