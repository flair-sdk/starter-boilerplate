SET 'execution.runtime-mode' = 'STREAMING';

--
-- Events
--
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
    'connector' = 'stream',
    'mode' = 'cdc',
    'namespace' = '{{ namespace }}',
    'entity-type' = 'Event',
    'scan.startup.mode' = 'timestamp',
    'scan.startup.timestamp-millis' = '{{ chrono("2 hours ago") * 1000 }}'
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

--
-- Transactions
--
CREATE TABLE source_transactions (
    `entityId` STRING,
    `entityUpdatedAt` BIGINT,
    `horizon` STRING,
    `chainId` INT,
    `blockHash` STRING,
    `blockNumber` BIGINT,
    `blockTimestamp` BIGINT,
    `blockForkIndex` BIGINT,
    `transactionIndex` BIGINT,
    `callType` STRING,
    `hash` STRING,
    `internal` BOOLEAN,
    `from` STRING,
    `to` STRING,
    `value` STRING,
    `data` STRING,
    `type` INT,
    `gasLimit` BIGINT,
    `gasPrice` STRING,
    `gasUsed` BIGINT,
    `effectiveGasPrice` STRING,
    `maxFeePerGas` STRING,
    `maxPriorityFeePerGas` STRING,
    `nonce` BIGINT,
    `input` STRING,
    `output` STRING,
    `status` BOOLEAN,
    `delivery` STRING,
    `ingestionReceivedAt` BIGINT,
    PRIMARY KEY (`entityId`) NOT ENFORCED
) WITH (
    'connector' = 'stream',
    'mode' = 'cdc',
    'namespace' = '{{ namespace }}',
    'entity-type' = 'Transaction',
    'scan.startup.mode' = 'timestamp',
    'scan.startup.timestamp-millis' = '{{ chrono("2 hours ago") * 1000 }}'
);

CREATE TABLE sink_transactions (
    `entityId` STRING,
    `entityUpdatedAt` BIGINT,
    `horizon` STRING,
    `chainId` INT,
    `blockHash` STRING,
    `blockNumber` BIGINT,
    `blockTimestamp` BIGINT,
    `blockForkIndex` BIGINT,
    `transactionIndex` BIGINT,
    `callType` STRING,
    `hash` STRING,
    `internal` BOOLEAN,
    `from` STRING,
    `to` STRING,
    `value` STRING,
    `data` STRING,
    `type` INT,
    `gasLimit` BIGINT,
    `gasPrice` STRING,
    `gasUsed` BIGINT,
    `effectiveGasPrice` STRING,
    `maxFeePerGas` STRING,
    `maxPriorityFeePerGas` STRING,
    `nonce` BIGINT,
    `input` STRING,
    `output` STRING,
    `status` BOOLEAN,
    `delivery` STRING,
    `ingestionReceivedAt` BIGINT,
    PRIMARY KEY (`entityId`) NOT ENFORCED
) WITH (
    'connector' = 'mongodb',
    'uri' = '{{ secret("mongodb.uri") }}',
    'database' = 'indexer',
    'collection' = 'transactions'
);

INSERT INTO sink_transactions SELECT * FROM source_transactions WHERE entityId IS NOT NULL;
