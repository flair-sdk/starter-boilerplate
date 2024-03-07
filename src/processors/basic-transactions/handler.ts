import { TransactionHandlerInput, database } from "flair-sdk";

export async function processTransaction({
  transaction,
  horizon,
}: TransactionHandlerInput) {
  await database.upsert({
    // Entity type is used to group entities together.
    // Here we're creating 1 entity for all transactions, both internal and top-level.
    entityType: "Transaction",

    // Unique ID for this entity.
    //
    // Some useful tips:
    // - chainId makes sure if potentially same tx has happened on different chains it will be stored separately.
    // - hash and logIndex make sure this event is stored uniquely.
    entityId: `${transaction.chainId}-${transaction.hash}-${transaction.localIndex}`,
    horizon,

    // Store all properties of the transaction as-is
    ...transaction,

    // Remove "transaction.events", because they are stored separately in "Event" entityType
    events: null,
  });
}
