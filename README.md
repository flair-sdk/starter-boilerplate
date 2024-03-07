# Indexing Starter Boilerplate

This repository contains boilerplate scripts, abis and schema for indexing (catch all contract events)

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

<br /> 

### 2️⃣ Install packages and authenticate:

```bash
pnpm i
pnpm flair auth
```

<br /> 

### 3️⃣ Set the namespace and config.json:

`config.dev.json` and `config.prod.json` are sample configs for `dev` and `prod` clusters.

Set a globally unique namespace in each config file (recommended to use `{ORG_NAME}-{ENV}`; e.g `sushiswap-dev` or `sushiswap-prod`) and then run:

```bash
# Setting configs for dev testing
cp config.dev.json config.json

# Or setting it for production
cp config.prod.json config.json
```

<br /> 

### 4️⃣ Generate manifest.yml and deploy:

```bash
pnpm generate-and-deploy
```

<br /> 

### 5️⃣ Backfill certain contracts or block ranges:

```bash
# Index last recent 10,000 blocks of a contract like this:
pnpm flair backfill --chain 1 --address 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc -d backward --max-blocks 10000

# Or you can backfill for a specific block number, for all relevant events and transactions:
pnpm flair backfill --chain 1 -b 17998797

# Or backfill for the recent data of your contracts in the last 5 minutes:
pnpm flair backfill --chain 1 --min-timestamp="5 mins ago" -d backward --address-csv ./contracts.csv 

# Or full history of addresses in a CSV, from contract creation to max of 100 million blocks after:
# Remember since this is a large backfill we must use "--provisioned" flag.
pnpm flair backfill --chain 1 --provisioned --max-executors 10 --max-blocks 100m --address-csv ./contracts.csv 
```

<br />

### 6️⃣ Look at the logs:

```bash
pnpm flair logs --full -tag Level=error
pnpm flair logs --full -tag Level=warn

pnpm flair logs --full -tag ProcessorId=basic-events
pnpm flair logs --full -tag ProcessorId=basic-transactions --watch

pnpm flair logs --full -tag TransactionHash=0x0000000000000000...
```

<br />

### 7️⃣ Explore your data in the playground:
<br />

Visit the [playground](https://api.flair.build) and run the following query in Examples section.

### 8️⃣ Sync the data to your own MongoDB (or others) database:

1. Add your credentaials as a secret:
```bash
pnpm flair secret set -n mongodb.uri -v mongodb+srv://USERNAME:PASSWORD@HOST:PORT/DB_NAME
```

2. Update the `config.json` to set `"databaseSync": true`

3. Run `pnpm generate-and-deploy` to enable the real-time syncing.

4. If you have some already-indexed but not-yet synced data, you can trigger manual syncs like:
```bash
pnpm flair enricher trigger database-full-sync-events
pnpm flair enricher trigger database-full-sync-transactions
```

## Examples

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

The current flow covers a very basic indexing use-case. For more advanced ones, check the list below:

- [Aggregate protocol fees in USD across multiple chains](https://github.com/flair-sdk/examples/tree/main/aggregate-protocol-fees-in-usd) <br/>
- [calculate "Health Factor" of positions with contract factory tracking](https://github.com/flair-sdk/examples/tree/main/health-factor-with-factory-tracking) <br/>
- [Uniswap v2 swaps with USD price for all contracts across all chains](https://github.com/flair-sdk/examples/tree/main/uniswap-v2-events-from-all-contracts-with-usd-price) <br/>

## FAQ

**Q:** How do I enable/disable real-time ingestion for indexer? <br />
**A:** For each indexer defined in `config.json`, you can enable/disable it via the `enabled: true/false` flag. Remember to run `pnpm generate-and-deploy` for the changes to apply on the cluster. <br/><br />
