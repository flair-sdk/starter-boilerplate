SET 'execution.runtime-mode' = 'BATCH';

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
    'connector' = 'database',
    'mode' = 'read',
    'namespace' = '{{ namespace }}',
    'entity-type' = 'Transaction'
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
