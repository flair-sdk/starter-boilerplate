import { refreshPool } from '../functions/pool';
import { EventHandlerInput } from 'flair-sdk';

export const processEvent = async (event: EventHandlerInput) => {
  try {
    await refreshPool(event);
  } catch (error) {
    throw error;
  }
};
