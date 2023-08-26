# Indexing

This repository contains boilerplate scripts, abis and schema for indexing (basic uniswap v2 swap data).

### Getting Started

1. Clone this repo:

```bash
git clone git@github.com:flair-sdk/starter-boilerplate.git
```

2. Install packages and authenticate:

```bash
pnpm i
pnpm flair auth
```

3. Set the namespace and config.json:

`config.dev.json` and `config.prod.json` are sample configs for `dev` and `prod` clusters.

* Set a globally unique namespace in each config file (recommended to use `{ORG_NAME}-{ENV}`; e.g `sushiswap-dev` or `sushiswap-prod`) and then run:

```bash
# Setting configs for dev testing
cp config.dev.json config.json

# Or setting it for production
cp config.prod.json config.json
```

4. Deploy

```bash
pnpm run deploy
```

5. Backfill any of the contracts for certain block range:

```bash
# Index last recent 10,000 blocks of a contract like this:
pnpm flair backfill --chain 1 --address 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc -d backward --max-blocks 10000
```

Or you can backfill for a specific block number, if you have certain events you wanna test with:

```bash
pnpm flair backfill --chain 1 -b 17998797
```

Or backfill for the recent data in the last X minutes:

```bash
pnpm flair backfill --chain 1 --min-timestamp="5 mins ago" -d backward
```

6. Look at the logs:

```bash
pnpm flair logs --full -tag Level=warn
pnpm flair logs --full -tag TransactionHash=0xXXXXX
pnpm flair logs --full -tag ProcessorId=swap-events
pnpm flair logs --full -tag ProcessorId=swap-events --watch
```

## Examples

#### Get all entity types total count

- Method: `POST`
- Endpoint: [https://graph.flair.dev/](https://graph.flair.dev/)
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
        namespace = 'vektor-finance'
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
**A:** For each indexer defined in `config.json`, you can enable/disable it via the `enabled: true/false` flag. Remember to run `pnpm deploy` for the changes to apply on the cluster. <br/><br />
