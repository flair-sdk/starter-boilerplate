# Indexing Starter Boilerplate

[![Flair](https://img.shields.io/badge/Powered%20by-Flair-ff69b4)](https://flair.dev)

This repository contains boilerplate scripts, abis and schema for indexing (catch all contract events/transactions) and syncing it to your own database.
> This example is for MongoDB, check out the [Database docs](https://docs.flair.dev/reference/database) for other databases.

## Table of Contents

- [🏁 Getting Started](#getting-started)
- [💎 Examples](#examples)
- [🚀 Next Steps](#next-steps)
- [🤔 FAQ](#faq)

## Getting Started

### 1️⃣ Clone this repo:

```bash
git clone https://github.com/flair-sdk/starter-boilerplate.git my-indexer
cd my-indexer
```

### 2️⃣ Install, authenticate and set secrets:

```bash
pnpm i
pnpm flair auth

pnpm flair secret set -n mongodb.uri -v mongodb+srv://USERNAME:PASSWORD@HOST:PORT/DB_NAME
```

### 3️⃣ Create config.json and set your namespace:

There are [`config.dev.json`](./config.dev.json) and [`config.prod.json`](./config.prod.json) sample configs for `dev` and `prod` clusters.

Set a globally unique namespace in each config file (recommended to use `{ORG_NAME}-{ENV}`; e.g `sushiswap-dev` or `sushiswap-prod`):

```bash
# Setting configs for dev testing
cp config.dev.json config.json

# Or setting it for production
cp config.prod.json config.json
```

### 4️⃣ Deploy your indexer:

```bash
pnpm generate-and-deploy
```

### 5️⃣ Backfill some historical data:

```bash
# You can backfill for a specific block number, for all relevant events and transactions:
pnpm flair backfill --chain 1 -b 17998797

# Or backfill for the recent data of your contracts in the last 5 minutes:
pnpm flair backfill --chain 1 --min-timestamp="5 mins ago" -d backward --address-csv ./contracts.csv 

# Sync backfilled historical data to your database
pnpm flair enricher trigger database-full-sync-events
pnpm flair enricher trigger database-full-sync-transactions
```

### 6️⃣ Look at the logs:

```bash
pnpm flair logs --full --watch

pnpm flair logs --full -tag Level=error
pnpm flair logs --full -tag Level=warn

pnpm flair logs --full -tag ProcessorId=basic-events
pnpm flair logs --full -tag ProcessorId=basic-transactions --watch
pnpm flair logs --full -tag TransactionHash=0x0000000000000000...
```
<br />

### 🔵 Explore your data in the playground:

Visit the [playground](https://api.flair.build) and run the following query in [Examples](#examples) section.

<br />

# Examples

#### Get all entity types total count

- Method: `POST`
- Endpoint: [https://api.flair.build/](https://api.flair.build/)
- Headers: `X-API-KEY: <your-api-key>`
- Body:

```graphql
query {
  sql(
    query: """
    SELECT
        *
    FROM
        entities
    WHERE
        namespace = 'boilerplate-dev'
    """
  ) {
    stats {
      elapsedMs
    }
    rows
  }
}
```

## Next Steps

The current flow covers a very basic indexing use-case. For more advanced ones, check out the [flair-sdk/examples](https://github.com/flair-sdk/examples) repository.

## FAQ

**Q:** How do I enable/disable real-time ingestion for indexer? <br />
**A:** For each indexer defined in `config.json`, you can enable/disable it via the `enabled: true/false` flag. Remember to run `pnpm generate-and-deploy` for the changes to apply on the cluster. <br/><br />
