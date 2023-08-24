import { database } from 'flair-sdk';

import { Entity } from '../../../../constants';


export async function handleInput({ data }): Promise<boolean> {
  if (!data || !data.poolId) {
    throw new Error(
      `Skipping processing pool, missing poolId: ${JSON.stringify({
        data,
      })}`,
    );
  }

  const { poolId, totalFeeCollectedUsd } = data;

  await database.upsert({
    entityType: Entity.POOL,
    entityId: poolId,
    totalFeeCollectedUsd
  });

  return true;
}
