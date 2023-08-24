SELECT
    poolId,
    SUM(feeUsd) as totalFeeCollectedUsd
FROM
    entities
WHERE
    namespace = 'itos-finance'
    AND entityType = 'Collect'
GROUP BY poolId