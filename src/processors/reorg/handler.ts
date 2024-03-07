import { graph, ReorgHandlerInput } from "flair-sdk";

export async function processReorg({ reorg }: ReorgHandlerInput) {
  console.debug("Received reorg event: ", { reorg });

  // 1) Delete all events for this block number with fork index lower than reorg.forkIndex
  const deleteQuery = `
    SELECT
      entityId, entityType
    FROM
      entities
    WHERE 
      namespace = '${process.env.NAMESPACE}' AND
      chainId = ${reorg.chainId} AND
      blockNumber = ${reorg.newBlock.number} AND
      forkIndex IS NOT NULL AND forkIndex < ${reorg.forkIndex}
  `;
  const deleteMutation = `
    mutation {
      deleteEntities(
        cluster: "${process.env.CLUSTER}"
        namespace: "${process.env.NAMESPACE}"
        tagKey: "reorg:${process.env.CLUSTER}:${reorg.chainId}"
        sql:
        """
          ${deleteQuery}
        """
      ) {
        id
        request
    
        createdAt
        startedAt
        updatedAt
    
        orchestrationState
        orchestrationError
      }
    }  
  `;

  console.debug("Scheduling delete: ", { deleteMutation });
  await graph.run(deleteMutation);

  // 2) Schedule an on-demand backfill for this block number so that it forces re-processing with the new fork index
  const backfillMutation = `
    mutation {
        backfillEvents(
            tagKey: "reorg"
            cluster: "${process.env.CLUSTER}"
            chainId: ${reorg.chainId}
            startBlockNumber: "${reorg.newBlock.number}"
            endBlockNumber: "${reorg.newBlock.number}"
            skipCaching: true
        ) {
            id
            request
        
            createdAt
            startedAt
            updatedAt
        
            orchestrationState
            orchestrationError
        }
    }
  `;

  console.debug("Scheduling backfill: ", { backfillMutation });
  await graph.run(backfillMutation);
};
