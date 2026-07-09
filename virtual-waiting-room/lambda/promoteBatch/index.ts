import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
    DynamoDBDocumentClient,
    QueryCommand,
    UpdateCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;
const STATUS_INDEX = "StatusIndex";

// Maximum active purchasers
const MAX_ACTIVE_USERS = 1000;

// Demo: Available slots to fill
const AVAILABLE_SLOTS = 100;

export const handler = async () => {

    try {

        const waitingUsers = await docClient.send(

            new QueryCommand({

                TableName: TABLE_NAME,

                IndexName: STATUS_INDEX,

                KeyConditionExpression: "#status = :status",

                ExpressionAttributeNames: {
                    "#status": "status"
                },

                ExpressionAttributeValues: {
                    ":status": "WAITING"
                },

                Limit: AVAILABLE_SLOTS

            })

        );

        const users = waitingUsers.Items ?? [];

        let batchId = Date.now();

        for (const user of users) {

            await docClient.send(

                new UpdateCommand({

                    TableName: TABLE_NAME,

                    Key: {

                        fanId: user.fanId

                    },

                    UpdateExpression:
                        "SET #status = :eligible, batchId = :batch",

                    ExpressionAttributeNames: {
                        "#status": "status"
                    },

                    ExpressionAttributeValues: {

                        ":eligible": "ELIGIBLE",

                        ":batch": batchId

                    }

                })

            );

        }

        return {

            statusCode: 200,

            body: JSON.stringify({

                promotedUsers: users.length,

                batchId: batchId,

                message: "Promotion completed successfully."

            })

        };

    }

    catch (error) {

        console.error(error);

        return {

            statusCode: 500,

            body: JSON.stringify({

                message: "Batch promotion failed."

            })

        };

    }

};
