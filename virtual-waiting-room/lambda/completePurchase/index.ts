import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
    DynamoDBDocumentClient,
    UpdateCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {

    try {

        const body = JSON.parse(event.body || "{}");

        const fanId = body.fanId;

        if (!fanId) {

            return {

                statusCode: 400,

                body: JSON.stringify({

                    message: "fanId is required."

                })

            };

        }

        await docClient.send(

            new UpdateCommand({

                TableName: TABLE_NAME,

                Key: {

                    fanId

                },

                UpdateExpression:
                    "SET #status = :purchased, estimatedWait = :completed",

                ExpressionAttributeNames: {

                    "#status": "status"

                },

                ExpressionAttributeValues: {

                    ":purchased": "PURCHASED",

                    ":completed": "Completed"

                }

            })

        );

        return {

            statusCode: 200,

            body: JSON.stringify({

                message: "Purchase completed successfully.",

                fanId,

                status: "PURCHASED"

            })

        };

    }

    catch (error) {

        console.error(error);

        return {

            statusCode: 500,

            body: JSON.stringify({

                message: "Failed to complete purchase."

            })

        };

    }

};
