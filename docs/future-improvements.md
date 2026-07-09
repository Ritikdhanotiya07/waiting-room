# Future Improvements

The current solution satisfies all requirements of the AWS DynamoDB Data Modeling Challenge.

Future enhancements can further improve performance and resilience.

---

## Amazon SQS

Queue incoming requests before processing.

Benefits

- Smooth traffic spikes
- Prevent request loss
- Better fault tolerance

---

## DynamoDB Streams

Automatically trigger events whenever user status changes.

Example

WAITING

↓

ELIGIBLE

↓

Trigger Lambda

---

## Amazon EventBridge

Publish queue events to downstream services.

Example

- User Promoted
- Purchase Completed
- Queue Closed

---

## AWS Lambda

Replace polling workers with event-driven processing.

Benefits

- Lower cost
- Faster promotion
- Better scalability

---

## Amazon CloudWatch

Monitor

- Active Purchasers
- Waiting Users
- API Latency
- Lambda Duration
- DynamoDB Read/Write Capacity

---

## Amazon CloudFront

Cache static waiting room pages globally.

Benefits

- Faster response
- Lower API traffic
- Better global performance

---

## Amazon ElastiCache (Redis)

Cache frequently requested queue status.

Benefits

- Reduce DynamoDB reads
- Lower latency
- Faster polling

---

## Multi Region Deployment

Deploy DynamoDB Global Tables.

Benefits

- Disaster Recovery
- Lower latency worldwide
- High availability

---

# Conclusion

The current architecture is production-ready for the challenge, while these enhancements would make the solution suitable for large-scale global ticketing platforms such as sports events, concerts, and international tournaments.
