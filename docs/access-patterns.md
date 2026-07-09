# Access Patterns

## Overview

Amazon DynamoDB is designed using an **access pattern first** approach. Instead of starting with table normalization, the design begins by identifying how the application will access the data.

The Virtual Waiting Room supports millions of concurrent users, therefore every access pattern is optimized for low latency and high throughput.

---

# Access Pattern 1 – Join Queue

## Description

When a fan enters the waiting room, a new record is created.

## DynamoDB Operation

PutItem

## Request

| Attribute | Value |
|------------|--------|
| fanId | fan000001 |
| status | WAITING |
| entryTimestamp | Server Timestamp |
| queuePosition | Generated Queue Number |
| batchId | 0 |

---

# Access Pattern 2 – Check Fan Status

## Description

A fan refreshes the page to check their current queue position.

## DynamoDB Operation

GetItem

## Primary Key

fanId

## Response

- Queue Position
- Current Status
- Estimated Wait Time

---

# Access Pattern 3 – Retrieve Waiting Fans

## Description

The Promotion Service retrieves the next users waiting in the queue.

## DynamoDB Operation

Query

## Index

StatusIndex

Partition Key

status = WAITING

Sort Key

queuePosition

Result

Users are returned in ascending queue order.

---

# Access Pattern 4 – Promote Fans

## Description

When ticket purchasing capacity becomes available, waiting users are promoted.

## DynamoDB Operation

UpdateItem

Status Transition

WAITING

↓

ELIGIBLE

---

# Access Pattern 5 – Retrieve Eligible Fans

## Description

Retrieve all users currently allowed to purchase tickets.

## DynamoDB Operation

Query

## Index

StatusIndex

Condition

status = ELIGIBLE

---

# Access Pattern 6 – Complete Purchase

## Description

When a fan successfully purchases tickets, the record is updated.

## DynamoDB Operation

UpdateItem

Status Transition

ELIGIBLE

↓

PURCHASED

---

# Access Pattern Summary

| Access Pattern | DynamoDB Operation |
|----------------|--------------------|
| Join Queue | PutItem |
| Check Fan Status | GetItem |
| Retrieve Waiting Fans | Query |
| Promote Fans | UpdateItem |
| Retrieve Eligible Fans | Query |
| Complete Purchase | UpdateItem |

---

# Design Benefits

- Single-digit millisecond latency
- Optimized for high read/write throughput
- Horizontally scalable
- Efficient querying using Global Secondary Index
- Minimal read/write cost
- Supports millions of concurrent users
