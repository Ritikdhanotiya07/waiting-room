# 🚀 Virtual Waiting Room using Amazon DynamoDB

![AWS](https://img.shields.io/badge/AWS-DynamoDB-orange)
![Challenge](https://img.shields.io/badge/AWS-Data%20Modeling%20Challenge-blue)
![Status](https://img.shields.io/badge/Project-Completed-success)

---

# Overview

This repository contains a scalable Amazon DynamoDB data model designed for the **AWS DynamoDB Data Modeling Challenge – Virtual Waiting Room**.

The system is capable of handling **10 million concurrent users** while ensuring:

- Fair queue assignment
- Massive concurrent writes
- Queue integrity
- Controlled user promotion
- Millisecond status queries
- High availability

---

# Problem Statement

During high-demand ticket sales, millions of fans arrive within seconds.

The waiting room must:

- Assign every fan a fair queue position.
- Prevent queue manipulation.
- Handle massive write bursts.
- Gradually promote users into the purchasing flow.
- Never overload downstream ticketing systems.

---

# Solution

Amazon DynamoDB is used as the primary database because it offers:

- Horizontal scalability
- Single-digit millisecond latency
- High throughput
- Automatic partition management
- Serverless architecture

---

# DynamoDB Table

Table Name

**WaitingRoom**

Primary Key

| Attribute | Type |
|------------|---------|
| fanId | String |

Global Secondary Index

| Index | Partition Key | Sort Key |
|---------|----------------|------------|
| StatusIndex | status | queuePosition |

---

# Table Attributes

| Attribute | Type | Description |
|------------|---------|-----------------------------|
| fanId | String | Unique Fan Identifier |
| queuePosition | Number | Queue Position |
| entryTimestamp | Number | Server Generated Timestamp |
| status | String | WAITING / ELIGIBLE / PURCHASED |
| batchId | Number | Promotion Batch |
| randomToken | String | Random Tie Breaker |
| estimatedWait | String | Estimated Waiting Time |

---

# Access Patterns

| Operation | DynamoDB API |
|------------|----------------|
| Join Queue | PutItem |
| Check Status | GetItem |
| Get Waiting Fans | Query |
| Promote Users | UpdateItem |
| Get Eligible Fans | Query |
| Complete Purchase | UpdateItem |

---

# Queue Assignment

Each fan receives:

- Server Timestamp
- Random Token

Queue ordering is generated using both values.

This prevents:

- Clock manipulation
- Queue gaming
- Timestamp collision

---

# Batch Promotion

The purchasing system accepts only **1000 active users**.

Promotion Worker continuously checks available slots.

Example

1000 Capacity

↓

940 Active

↓

Promote Next 60 Waiting Users

↓

1000 Active Again

---

# Fan Status API

Each fan queries using

fanId

Response

- Queue Position
- Current Status
- Estimated Wait Time

---

# Scalability

Supports

- 10 Million Concurrent Users
- Millions of Writes
- Millions of Reads
- Automatic DynamoDB Scaling

---

# Folder Structure

```
virtual-waiting-room
│
├── README.md
├── waiting-room-model.json
├── sample-data
├── cloudformation
├── lambda
├── docs
├── diagrams
└── images
```

---

# Future Improvements

- Amazon EventBridge
- Amazon SQS
- AWS Lambda Streams
- DynamoDB Streams
- Amazon CloudWatch Monitoring

---

# Author

AWS DynamoDB Data Modeling Challenge Submission
