import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
    DynamoDBDocumentClient,
    GetCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {

    try {

        const fanId =
            event.queryStringParameters?.fanId;

        if (!fanId) {

            return {

                statusCode: 400,

                body: JSON.stringify({

                    message: "fanId is required."

                })

            };

        }

        const result = await docClient.send(

            new GetCommand({

                TableName: TABLE_NAME,

                Key: {

                    fanId

                }

            })

        );

        if (!result.Item) {

            return {

                statusCode: 404,

                body: JSON.stringify({

                    message: "Fan not found."

                })

            };

        }

        return {

            statusCode: 200,

            body: JSON.stringify({

                fanId: result.Item.fanId,

                queuePosition: result.Item.queuePosition,

                status: result.Item.status,

                batchId: result.Item.batchId,

                estimatedWait: result.Item.estimatedWait,

                entryTimestamp: result.Item.entryTimestamp

            })

        };

    }

    catch (error) {

        console.error(error);

        return {

            statusCode: 500,

            body: JSON.stringify({

                message: "Internal Server Error"

            })

        };

    }

};
