import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class VirtualWaitingRoomStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {

        super(scope, id, props);

        const waitingRoomTable = new dynamodb.Table(this, 'WaitingRoomTable', {

            tableName: 'WaitingRoom',

            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,

            partitionKey: {
                name: 'fanId',
                type: dynamodb.AttributeType.STRING
            },

            removalPolicy: cdk.RemovalPolicy.DESTROY

        });

        waitingRoomTable.addGlobalSecondaryIndex({

            indexName: 'StatusIndex',

            partitionKey: {
                name: 'status',
                type: dynamodb.AttributeType.STRING
            },

            sortKey: {
                name: 'queuePosition',
                type: dynamodb.AttributeType.NUMBER
            },

            projectionType: dynamodb.ProjectionType.ALL

        });

        const joinQueueLambda = new lambda.Function(this, 'JoinQueueLambda', {

            runtime: lambda.Runtime.NODEJS_20_X,

            handler: 'index.handler',

            code: lambda.Code.fromAsset('lambda/joinQueue'),

            environment: {
                TABLE_NAME: waitingRoomTable.tableName
            }

        });

        const getStatusLambda = new lambda.Function(this, 'GetStatusLambda', {

            runtime: lambda.Runtime.NODEJS_20_X,

            handler: 'index.handler',

            code: lambda.Code.fromAsset('lambda/getStatus'),

            environment: {
                TABLE_NAME: waitingRoomTable.tableName
            }

        });

        waitingRoomTable.grantReadWriteData(joinQueueLambda);
        waitingRoomTable.grantReadData(getStatusLambda);

        const api = new apigateway.RestApi(this, 'WaitingRoomApi', {

            restApiName: 'WaitingRoom API'

        });

        const join = api.root.addResource('join');

        join.addMethod(
            'POST',
            new apigateway.LambdaIntegration(joinQueueLambda)
        );

        const status = api.root.addResource('status');

        status.addMethod(
            'GET',
            new apigateway.LambdaIntegration(getStatusLambda)
        );

        new cdk.CfnOutput(this, 'ApiUrl', {

            value: api.url

        });

    }

}
const completePurchaseLambda = new lambda.Function(this, 'CompletePurchaseLambda', {

    runtime: lambda.Runtime.NODEJS_20_X,

    handler: 'index.handler',

    code: lambda.Code.fromAsset('lambda/completePurchase'),

    environment: {

        TABLE_NAME: waitingRoomTable.tableName

    }

});
