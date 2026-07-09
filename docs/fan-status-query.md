# Fan Status Query Design

## Overview

The Virtual Waiting Room allows every fan to check their current queue status in real time. Since millions of users may refresh the page simultaneously, the status lookup must be extremely fast and scalable.

Amazon DynamoDB provides single-digit millisecond latency for key-value lookups, making it an ideal choice for this access pattern.

---

# Objective

Each fan should be able to retrieve:

- Current Queue Position
- Current Status
- Estimated Wait Time
- Batch ID

The response should be returned with minimum latency even during peak traffic.

---

# Query Workflow

Step 1

The fan opens the waiting room page.

↓

Step 2

The application sends the fanId to the backend.

↓

Step 3

The backend performs a GetItem operation using the Primary Key.

↓

Step 4

DynamoDB returns the latest fan record.

↓

Step 5

The API returns:

- Queue Position
- Status
- Estimated Wait Time
- Batch ID

---

# DynamoDB Operation

Operation

GetItem

Primary Key

fanId

Example Request

fanId = fan000245

---

# Example Response

fanId

fan000245

queuePosition

245

status

WAITING

batchId

3

estimatedWait

7 Minutes

---

# Estimated Wait Time

Estimated wait time is calculated based on:

- Current Queue Position
- Average Ticket Purchase Time
- Number of Active Purchasers
- Current Promotion Rate

Example

Queue Position

2500

Average Purchase Time

30 Seconds

Active Purchasers

1000

Estimated Wait

12 Minutes

---

# Polling Strategy

Instead of refreshing every second, the client polls the backend every 10–15 seconds.

Benefits

- Reduces read traffic
- Lowers operational cost
- Improves overall scalability
- Prevents unnecessary requests

---

# High Traffic Optimization

To support millions of concurrent users:

- Use GetItem with Primary Key.
- Avoid table scans.
- Avoid filtering.
- Keep response payload small.
- Enable Auto Scaling.
- Use PAY_PER_REQUEST billing mode.

---

# Error Handling

If the fan record does not exist:

Return

Status = NOT_FOUND

If the fan has completed purchasing:

Return

Status = PURCHASED

If the session has expired:

Return

Status = EXPIRED

---

# Advantages

- Millisecond response time
- Low read cost
- High scalability
- Simple key-value lookup
- Supports millions of concurrent status checks
- Optimized for DynamoDB best practices

---

# Summary

The fan status query uses a direct GetItem request on the Primary Key (fanId), providing a highly scalable and low-latency mechanism for users to check their queue position, eligibility status, and estimated waiting time during large-scale ticket sales.
