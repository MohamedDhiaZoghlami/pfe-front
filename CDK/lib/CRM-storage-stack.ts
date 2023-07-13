import {
    Stack, StackProps,
    aws_s3 as s3,
    RemovalPolicy,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_ssm as ssm
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CRMStorageStack extends Stack {
    public readonly objectBucket: s3.IBucket;
    public readonly distribution: cloudfront.IDistribution

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.objectBucket = new s3.Bucket(this, "CRM-Object-Bucket", {
            bucketName: "crm-object-bucket",
            accessControl: s3.BucketAccessControl.PRIVATE,
            publicReadAccess: false,
            encryption: s3.BucketEncryption.S3_MANAGED,
            versioned: false,
            removalPolicy: RemovalPolicy.DESTROY,

            // objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
            // blockPublicAccess: new s3.BlockPublicAccess(
            //     {
            //         blockPublicAcls: false,
            //         blockPublicPolicy: false,
            //         ignorePublicAcls: false,
            //         restrictPublicBuckets: false
            //     }
            // ),
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
        new ssm.StringParameter(this, "CRM_BucketObjectName-EXPORT", {
            stringValue: this.objectBucket.bucketName,
            parameterName: '/CRM/buckets/assets_bucket_name'
        });

        const oin = new cloudfront.OriginAccessIdentity(this, 'CRM-Storage-origin-access-identity');

        this.objectBucket.grantReadWrite(oin);

        this.distribution = new cloudfront.Distribution(this, `CRM-Assets-Distribution`, {
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
            comment: `CRM Assets Distribution`,
            defaultBehavior: {
                origin: new origins.S3Origin(this.objectBucket, { originAccessIdentity: oin }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
            },
            enabled: true
        });
        new ssm.StringParameter(this, "CRM_AssetsDistribution-EXPORT", {
            stringValue: this.distribution.distributionDomainName,
            parameterName: '/CRM/distributions/assets_distribution_domain_name'
        });


    }
}
