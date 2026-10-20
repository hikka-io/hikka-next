import type { UserCustomizationResponse } from '@hikka/api';

// One writer for the whole app: the PUT replaces the document, so two in flight could land out of order.
export const writer: {
    inFlight: boolean;
    queued: UserCustomizationResponse | null;
    epoch: number;
} = { inFlight: false, queued: null, epoch: 0 };

/**
 * Forget the queue when the session changes: a request still in flight belongs to the previous
 * account, so its result must not touch the cache of the next one.
 */
export function resetSessionUIWriter() {
    writer.queued = null;
    writer.inFlight = false;
    writer.epoch += 1;
}
