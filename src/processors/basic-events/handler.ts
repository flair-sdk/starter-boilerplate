import { database } from "flair-sdk";
// OPTIONAL: import { blockchain } from 'flair-sdk';
import { EventHandlerInput } from "flair-sdk";

export const processEvent = async (event: EventHandlerInput) => {
  // OPTIONAL: You can fetch full transaction data if you need it.
  //
  // const provider = await blockchain.getProvider(event.chainId);
  // const transaction = await provider
  //   .cached()
  //   .getTransactionReceipt(event.txHash);

  await database.upsert({
    // Entity type is used to group entities together.
    // Here we're creating 1 entity for all events, but you can also create 1 per event.
    entityType: "Event",

    // Unique ID for this entity.
    //
    // Some useful tips:
    // - chainId makes sure if potentially same tx has happened on different chains it will be stored separately.
    // - hash and logIndex make sure this event is stored uniquely.
    entityId: `${event.chainId}-${event.txHash}-${event.log.logIndex}`,

    // Horizon helps with chronological ordering of events and handling re-orgs.
    // This object will automatically create blockNumber and logIndex fields on your entity,
    // so no need to add them separately.
    horizon: event.horizon,

    // You can store any data you want, even every single entity of the same type can have different fields.
    // Must not include "entityId" field as it's already defined above.
    chainId: event.chainId,
    contractAddress: event.log.address,
    blockTimestamp: event.blockTimestamp,

    // OPTIONAL: Uncomment if you need actual EOA that sent this tx.
    //
    // txFrom: transaction.from,
    // txTo: transaction.to,
    txHash: event.txHash,

    eventName: event.parsed?.name || "UnknownEvent",

    // Save all event args as-is (and for unknown events store raw topics and data)
    ...(event.parsed?.args || {
      topic0: event.log.topics?.[0],
      topic1: event.log.topics?.[1],
      topic2: event.log.topics?.[2],
      topic3: event.log.topics?.[3],
      data: event.log.data,
    }),
  });
};
