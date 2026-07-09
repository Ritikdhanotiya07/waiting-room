# Queue Assignment Strategy

## Overview

The Virtual Waiting Room is designed to fairly assign queue positions to millions of fans arriving within seconds. The primary objective is to prevent queue manipulation while maintaining high throughput and low latency.

---

# Fair Queue Assignment

Every fan joining the waiting room receives:

- A unique Fan ID
- A server-generated timestamp
- A cryptographically secure random token
- A sequential queue position

The backend service generates all values to ensure fairness.

---

# Queue Assignment Workflow

Step 1

The fan clicks **Join Queue**.

↓

Step 2

The request is received by the Queue Assignment Service.

↓

Step 3

The server generates:

- Server Timestamp
- Random Token

↓

Step 4

The fan is assigned the next available queue position.

↓

Step 5

The record is stored in DynamoDB.

↓

Step 6

The fan immediately receives:

- Queue Position
- Current Status
- Estimated Wait Time

---

# Why Server Timestamp?

Client devices cannot be trusted because:

- Users may change their system clock.
- Devices may have different time zones.
- Network latency varies.

To ensure fairness, timestamps are generated only by the backend service.

---

# Random Token

Multiple fans may arrive during the same millisecond.

Example

Server Timestamp

10:00:00.123

Fans

Fan A

Fan B

Fan C

All have identical timestamps.

A secure random token is generated for every fan.

Example

Fan A

Random Token

A8K92L

Fan B

Random Token

B4T18X

Fan C

Random Token

D9M55P

The random token guarantees deterministic ordering without allowing users to influence their queue position.

---

# Preventing Queue Manipulation

The system prevents:

✓ Client clock modification

✓ Duplicate requests

✓ Timestamp spoofing

✓ Queue jumping

✓ Replay attacks

Only trusted backend services assign queue positions.

---

# Handling Simultaneous Arrivals

The waiting room supports millions of concurrent requests.

Every request follows the same flow:

Join Queue

↓

Generate Server Timestamp

↓

Generate Random Token

↓

Assign Queue Position

↓

Store in DynamoDB

This guarantees consistent ordering even during extreme traffic spikes.

---

# DynamoDB Record Example

fanId

fan000245

queuePosition

245

entryTimestamp

1783459200

status

WAITING

batchId

2

randomToken

H8P92K

estimatedWait

6 Minutes

---

# Advantages

- Fair queue ordering
- Resistant to manipulation
- High write throughput
- Low latency
- Horizontally scalable
- Suitable for millions of concurrent users

---

# Summary

The queue assignment strategy ensures every fan receives a verifiable and fair queue position using trusted server timestamps and secure random tie-breaking, making the waiting room reliable even during peak traffic events.
