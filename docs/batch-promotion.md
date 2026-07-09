# Batch Promotion Strategy

## Overview

The Virtual Waiting Room controls the number of users entering the ticket purchasing platform by promoting fans in small batches instead of allowing everyone to enter simultaneously.

This prevents server overload while ensuring a fair purchasing experience.

---

# Objective

Maintain a fixed number of active purchasers.

For this design, the maximum number of active users is:

**1000 Users**

Whenever active users leave the purchasing system, new users are promoted automatically.

---

# Promotion Workflow

Step 1

Fans enter the waiting room.

↓

Status = WAITING

↓

Step 2

The Promotion Service continuously monitors the number of active purchasers.

↓

Step 3

If available capacity exists, the next users are selected.

↓

Step 4

Users are promoted.

Status changes from

WAITING

↓

ELIGIBLE

↓

Step 5

Users enter the ticket purchasing platform.

---

# Promotion Logic

Maximum Purchasing Capacity

1000 Users

Example

Current Active Users

940

Available Capacity

60

Promotion Service queries the next 60 waiting users from DynamoDB.

These users receive:

Status = ELIGIBLE

Batch ID = Next Batch Number

---

# DynamoDB Query

Index

StatusIndex

Partition Key

status = WAITING

Sort Key

queuePosition

Limit

60

This returns the next 60 users in queue order.

---

# Batch Update

Each selected record is updated.

Example

Before

Status

WAITING

BatchId

0

After

Status

ELIGIBLE

BatchId

25

---

# Promotion Trigger

Promotion is triggered whenever:

- A purchase is completed
- A user leaves the queue
- A session expires
- Active purchaser count drops below 1000

---

# Preventing Overload

The Promotion Service never promotes more users than available capacity.

Example

Capacity

1000

Current Active

992

Available Slots

8

Only the next 8 waiting users are promoted.

This prevents downstream ticket servers from being overloaded.

---

# Advantages

- Smooth traffic flow
- Fair queue progression
- Prevents sudden traffic spikes
- Efficient resource utilization
- Automatic capacity management
- High scalability

---

# Example Timeline

Initial State

WAITING

1 - 1000

↓

ELIGIBLE

1001 - 2000

↓

PURCHASED

Users Complete Purchase

↓

Promotion Worker

↓

Next Waiting Users Become Eligible

↓

Active Purchasers = 1000

---

# Summary

The batch promotion strategy continuously fills available purchasing capacity by promoting waiting users in queue order. This ensures fairness, protects downstream systems, and maintains a consistent number of active purchasers throughout the ticket sale.
