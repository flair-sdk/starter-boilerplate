import { blockchain, database, EventHandlerInput, Entity as FlairEntity } from 'flair-sdk';
import BigNumber from 'bignumber.js'; 
import { fetchUsdPrice } from './common';

const POOL_FUNCTIONS_ABI: string[] = [
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function slot0() view returns (uint160, int24, uint16, uint16, uint8, bool)',
];

const TOKEN_FUNCTIONS_ABI: string[] = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];


export type Pool = FlairEntity<{
  token0: string;
  token1: string;
}>


const refreshPool = async function (event: EventHandlerInput) {
  const { chainId, horizon } = event;
  const poolAddress = event.log.address;
  const poolId = `${chainId.toString()}:${poolAddress.toString()}`.toLowerCase();

  const poolContract = (
    await blockchain.getContract(chainId, poolAddress, POOL_FUNCTIONS_ABI)
  ).cached();

  /**
   * If pool already exists, get it from db; otherwise call the contract
   */
  const pool = await getPool(poolId);

  const [token0, token1] = pool
    ? [pool.token0, pool.token1]
    : await Promise.all([poolContract.token0(), poolContract.token1()]);

  const token0Contract = (
    await blockchain.getContract(chainId, token0, TOKEN_FUNCTIONS_ABI)
  ).cached();

  const token1Contract = (
    await blockchain.getContract(chainId, token1, TOKEN_FUNCTIONS_ABI)
  ).cached();

  const [reserve0, reserve1, token0Decimals, token1Decimals] = await Promise.all([
    token0Contract.balanceOf(poolAddress),
    token1Contract.balanceOf(poolAddress),
    token0Contract.decimals(),
    token1Contract.decimals(),
  ]);

  const [reserve0Usd, reserve1Usd] = await Promise.all([
    fetchUsdPrice({
      event,
      token: token0,
      amount: reserve0,
    }),
    fetchUsdPrice({
      event,
      token: token1,
      amount: reserve1,
    }),
  ]);

  /**
   * Either get the `sqrtPriceX96` from `slot0()` which does not change
   * with events like `burn/collect/mint`; It only changes with `swap` where
   * we are getting it directly from the event
   */
  const sqrRootValue =
    event.parsed.args?.sqrtPriceX96 ?? (await getSqrtPriceX96(poolContract));

  const { unitPrice0, unitPrice1 } = sqrtPriceX96ToTokenPrices(
    sqrRootValue,
    token0Decimals,
    token1Decimals,
  );

  return await database.upsert({
    entityType: 'Pool',
    entityId: poolId,
    horizon: horizon,
    chainId,
    poolAddress,

    token0: token0?.toLowerCase(),
    token1: token1?.toLowerCase(),

    reserve0,
    reserve1,
    reserve0Usd,
    reserve1Usd,

    unitPrice0,
    unitPrice1,
  });
};

function sqrtPriceX96ToTokenPrices(
  sqrtPriceX96: number,
  token0Decimals: number,
  token1Decimals: number,
) {
  const Q192 = new BigNumber(2).exponentiatedBy(192);
  const exp = new BigNumber(sqrtPriceX96).multipliedBy(sqrtPriceX96);
  const expBD = new BigNumber(exp.toString());
  const q192BD = new BigNumber(Q192.toString());
  const numerator = Number(expBD.dividedBy(q192BD).toString());
  const denominator = 10 ** token0Decimals / 10 ** token1Decimals;
  const unitPrice1 = numerator * denominator;
  const unitPrice0 = unitPrice1 !== 0 ? 1 / unitPrice1 : 0;
  return { unitPrice0, unitPrice1 };
}

async function getSqrtPriceX96(poolContract: any) {
  const [slot0] = await Promise.all([poolContract.slot0()]);
  const sqrtPriceX96 = new BigNumber(slot0[0]);
  return sqrtPriceX96;
}

const getPool = async function (poolId: string, cache = true) : Promise<Pool | null> {
  return await database.get({
    entityType: 'Pool',
    entityId: poolId,
    cache,
  });
};

export {
  POOL_FUNCTIONS_ABI,
  sqrtPriceX96ToTokenPrices,
  getSqrtPriceX96,
  getPool,
  refreshPool,
};
