import { ReorgHandlerInput, core } from 'flair-sdk'

export async function processReorg({ reorg }: ReorgHandlerInput) {
  const entities = await core.listEntityTypes()
  await core.removeEntitiesByBlock(reorg.chainId, reorg.newBlock.number, reorg.forkIndex, entities)
  await core.ingestBlockByNumber(reorg.chainId, reorg.newBlock.number)
}
