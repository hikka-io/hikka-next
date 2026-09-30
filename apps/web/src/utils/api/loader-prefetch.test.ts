import { afterEach, describe, expect, it, vi } from 'vitest';

import { awaitOnServer } from './loader-prefetch';

afterEach(() => {
    vi.unstubAllGlobals();
});

function gate() {
    let release!: () => void;
    const promise = new Promise<void>((done) => {
        release = done;
    });
    return { promise, release };
}

describe('awaitOnServer', () => {
    it('waits for every prefetch on the server', async () => {
        vi.stubGlobal('window', undefined);
        const first = gate();
        const second = gate();
        let settled = false;
        const waiting = awaitOnServer([first.promise, second.promise]).then(
            () => {
                settled = true;
            },
        );

        first.release();
        await new Promise((done) => setTimeout(done, 0));
        expect(settled).toBe(false);

        second.release();
        await waiting;
        expect(settled).toBe(true);
    });

    it('returns at once on the client', async () => {
        const pending = gate();

        await expect(awaitOnServer([pending.promise])).resolves.toBeUndefined();
    });
});
