# Indexing

This repository contains boilerplate scripts, abis and schema.

### Getting Started

You can deploy both to `dev` and `prod` clusters:

1. Install latest flair-cli:

```bash
npm i -g flair-cli
```

2. Authenticate and install packages:

```bash
flair auth
pnpm i
```

3. Set the config.json:

```bash
# setting configs for dev testing
cp config.dev.json config.json
# or setting it for production testing
cp config.prod.json config.json
```

4. Deploy

```bash
pnpm run deploy
```

4. Backfill any of the contracts for certain block range:

```bash
# Index last recent 10,000 blocks of a contract like this:
flair backfill --chain 1 --address 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc -d backward --max-blocks 10000
```

Or you can backfill for a specific block number, if you have certain events you wanna test with:

```bash
flair backfill --chain 1 -b 17998797
```

Or backfill for the recent data in the last X minutes:

```bash
flair backfill --chain 1 --min-timestamp="5 mins ago"
```

5. Look at the logs:

```bash
flair logs --full -tag Level=warn
flair logs --full -tag TransactionHash=0xXXXXX
flair logs --full -tag ProcessorId=swap-events
flair logs --full -tag ProcessorId=swap-events --watch
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

[Aggregate protocol fees in USD across multiple chains](https://github.com/flair-sdk/examples/tree/main/aggregate-protocol-fees-in-usd)
[calculate "Health Factor" of positions with contract factory tracking](https://github.com/flair-sdk/examples/tree/main/health-factor-with-factory-tracking)
[Uniswap v2 swaps with USD price for all contracts across all chains](https://github.com/flair-sdk/examples/tree/main/uniswap-v2-events-from-all-contracts-with-usd-price)

## FAQ

**Q:** How do I enable/disable real-time ingestion for indexer?
**A:** For each indexer defined in `config.json` and `manifest.yml`, you can enable/disable it via the `enabled: true/false` flag
