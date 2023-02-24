# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

# Tech Stack

<ol>
  <li>Node. You can use any framework you want (i.e. Nestjs with an ORM like TypeOrm or Prisma) </li>
  <li>Any database</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.

# Solution
Use compose to build and start containers, I use detach (`-d`) mode to run compose in background mode:
```bash
docker compose up -d --build
```

When containers start running, You can use the port 3000 to consume the enpoint to create a transaction
```bash
curl -X POST http://localhost:3000/transactions
     -H 'Content-Type: application/json'
     -H 'Accept: application/json'
     -d '{"accountExternalIdDebit": "dsf", "accountExternalIdCredit": "string", "tranferTypeId": 10, "value": 10010}'
```

You'll get the entity as response

```json
{
    "id": "72d3af06-55c5-4d04-861a-28125d653e76",
    "accountExternalIdDebit": "dsf",
    "accountExternalIdCredit": "string",
    "tranferTypeId": 10,
    "value": 10010,
    "createdAt": "2023-02-24T18:08:00.110Z",
    "transactionStatus": "pending",
    "validatedByAntiFraud": false
}
```

The enpoint also send an event and `yape_anti-fraud_service` will listen the message in order to process this transaction. 
You could check the transaction using the endpoint:
```bash
curl -X GET http://localhost:3000/transactions/72d3af06-55c5-4d04-861a-28125d653e76
     -H 'Content-Type: application/json'
     -H 'Accept: application/json'
```

the response will be :
```json
{
    "id": "7ba33f78-1ced-4fd3-a168-c2514e00c142",
    "accountExternalIdDebit": "dsf",
    "accountExternalIdCredit": "string",
    "tranferTypeId": 10,
    "value": 10010,
    "createdAt": "2023-02-24T18:18:32.258Z",
    "transactionStatus": "rejected",
    "validatedByAntiFraud": true
}
```