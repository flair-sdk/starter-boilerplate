SET 'execution.runtime-mode' = 'BATCH';

CREATE TABLE source_events (
    `entityId` STRING,
    `entityUpdatedAt` BIGINT,
    `chainId` INT,
    `contractAddress` STRING,
    `horizon` STRING,
    `blockNumber` BIGINT,
    `blockTimestamp` BIGINT,
    `forkIndex` BIGINT,
    `transactionIndex` BIGINT,
    `logIndex` BIGINT,
    `txHash` STRING,
    `eventName` STRING,
    `topic0` STRING,
    `topic1` STRING,
    `topic2` STRING,
    `topic3` STRING,
    `data` STRING,
    `args` STRING,
    PRIMARY KEY (`entityId`) NOT ENFORCED
) WITH (
    'connector' = 'database',
    'mode' = 'read',
    'namespace' = '{{ namespace }}',
    'entity-type' = 'Event'
);

CREATE TABLE sink_events (
    `entityId` STRING,
    `entityUpdatedAt` BIGINT,
    `chainId` INT,
    `contractAddress` STRING,
    `horizon` STRING,
    `blockNumber` BIGINT,
    `blockTimestamp` BIGINT,
    `forkIndex` BIGINT,
    `transactionIndex` BIGINT,
    `logIndex` BIGINT,
    `txHash` STRING,
    `eventName` STRING,
    `topic0` STRING,
    `topic1` STRING,
    `topic2` STRING,
    `topic3` STRING,
    `data` STRING,
    `args` STRING,
    PRIMARY KEY (`entityId`) NOT ENFORCED
) WITH (
    'connector' = 'mongodb',
    'uri' = '{{ secret("mongodb.uri") }}',
    'database' = 'indexer',
    'collection' = 'events'
);

INSERT INTO sink_events SELECT * FROM source_events WHERE entityId IS NOT NULL;
