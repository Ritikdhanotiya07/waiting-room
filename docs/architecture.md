# System Architecture

## Overview

The Virtual Waiting Room architecture is designed to handle millions of concurrent users while ensuring fairness, scalability, and low latency. The architecture separates queue assignment, queue management, fan status lookup, and ticket purchasing into independent components.

---

# High-Level Architecture

```
                        +----------------------+
                        |      Millions of     |
                        |         Fans         |
                        +----------+-----------+
                                   |
                                   |
                                   ▼
                      Amazon API Gateway
                                   |
                                   ▼
                    Queue Assignment Service
                            (AWS Lambda)
                                   |
             Generates Queue Position & Random Token
                                   |
                                   ▼
                  Amazon DynamoDB (WaitingRoom)
                                   |
          +------------------------+-----------------------+
          |                                                |
          ▼                                                ▼
 Promotion Worker                              Fan Status Service
 (AWS Lambda)                                   (AWS Lambda)
          |                                                |
          ▼                                                ▼
 WAITING → ELIGIBLE                         Queue Position + ETA
          |
          ▼
 Ticket Purchasing Platform
 (Maximum 1000 Active Users)
```

---

# Component Description

## 1. Amazon API Gateway

Receives all incoming requests from fans.

Responsibilities

- Accept Join Queue requests
- Accept Status requests
- Forward requests to Lambda

---

## 2. Queue Assignment Service

AWS Lambda assigns:

- Server Timestamp
- Random Token
- Queue Position

The service stores the fan record in DynamoDB.

Operation

PutItem

---

## 3. Amazon DynamoDB

Acts as the central waiting room database.

Stores

- Fan ID
- Queue Position
- Queue Status
- Batch ID
- Estimated Wait Time

Primary Key

fanId

Global Secondary Index

StatusIndex

---

## 4. Promotion Worker

Runs periodically using AWS Lambda.

Responsibilities

- Monitor purchasing capacity
- Retrieve next waiting users
- Promote users to ELIGIBLE
- Assign Batch IDs

Operations

Query

UpdateItem

---

## 5. Fan Status Service

Provides real-time queue information.

Request

fanId

Response

- Queue Position
- Current Status
- Estimated Wait Time

Operation

GetItem

---

## 6. Ticket Purchasing Platform

Allows only eligible users to purchase tickets.

Maximum Active Users

1000

When users complete purchases, new waiting users are promoted.

---

# Request Flow

## Join Queue

Fan

↓

API Gateway

↓

Queue Assignment Lambda

↓

Generate Timestamp

↓

Generate Random Token

↓

Assign Queue Position

↓

Store Record in DynamoDB

↓

Return Queue Position

---

## Check Status

Fan

↓

API Gateway

↓

Status Lambda

↓

GetItem

↓

Return Queue Position

Return ETA

Return Status

---

## Batch Promotion

Promotion Worker

↓

Query Waiting Users

↓

Update Status

↓

ELIGIBLE

↓

Users Enter Purchasing Platform

---

# AWS Services Used

- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon CloudWatch (Monitoring)
- AWS IAM
- DynamoDB Global Secondary Index

---

# Advantages

- Fully Serverless
- Automatic Scaling
- High Availability
- Millisecond Response Time
- Fault Tolerant
- Cost Efficient
- Handles Millions of Concurrent Users

---

# Summary

The proposed architecture combines API Gateway, AWS Lambda, and Amazon DynamoDB to build a highly scalable Virtual Waiting Room. The design ensures fair queue assignment, efficient batch promotion, and real-time status updates while protecting downstream ticket purchasing systems from overload.
