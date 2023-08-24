import { integrations, EventHandlerInput } from 'flair-sdk';

interface FetchUsdPriceParams {
  event: EventHandlerInput;
  token: string;
  amount: number;
}

const fetchUsdPrice = async function ({
  event,
  token,
  amount,
}: FetchUsdPriceParams): Promise<number | null> {
  if (token && amount) {
    const price = await integrations.prices.getUsdAmountByAddress({
      chainId: event.chainId,
      tokenAddress: token,
      tokenAmount: amount,
      idealBlockNumber: event.blockNumber,
      idealTimestamp: event.blockTimestamp,
    });

    return price ? price.amountUsd : null;
  }

  return null;
};

export { fetchUsdPrice };
