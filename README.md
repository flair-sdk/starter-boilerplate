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

3. Deploy to `dev` cluster (this will generate config.json and manifest.yml file from templates):

```bash
pnpm run generate:dev
pnpm run deploy:dev

# or to prod
pnpm run generate:prod
pnpm run deploy:prod
```

Remember that real-time ingestion is not enabled for `dev and `prod`` cluster, so you need to backfill a certain contract address to get data.

4. Backfill any of the contracts for certain block range:

```bash
# Index last recent 10,000 blocks of a contract like this:
flair backfill --chain 1 --address 0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640 -d backward --max-blocks 10000
```

Or you can backfill for a specific block number, if you have certain events you wanna test with:

```bash
flair backfill --chain 1 --address 0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640 -b 105626185
```

Or backfill all the Vault events from a specific block number until latest:

```bash
flair backfill --chain 1 --topic-abi src/pool-events/abi.json -b 105600000 --max-blocks 1000000
```

5. Look at the logs:

```bash
flair logs --full -tag Level=warn
flair logs --full -tag ProcessorId=pool-events
flair logs --full -tag ProcessorId=pool-events --watch
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
