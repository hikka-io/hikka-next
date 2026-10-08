import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEBOUNCE_MS, useDebounce } from './use-debounce';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function mountProbe(initial: string, delay?: number) {
    let latest = initial;
    const Probe = ({ value }: { value: string }) => {
        [latest] = useDebounce({ value, delay });
        return null;
    };
    const root = createRoot(document.createElement('div'));
    act(() => root.render(<Probe value={initial} />));

    return {
        get value() {
            return latest;
        },
        set: (value: string) => act(() => root.render(<Probe value={value} />)),
        unmount: () => act(() => root.unmount()),
    };
}

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

describe('DEBOUNCE_MS', () => {
    it('pins the typing and commit delays', () => {
        expect(DEBOUNCE_MS).toEqual({ input: 300, commit: 500 });
    });
});

describe('useDebounce', () => {
    it('defaults to the commit delay', () => {
        const probe = mountProbe('a');
        probe.set('b');

        act(() => vi.advanceTimersByTime(DEBOUNCE_MS.commit - 1));
        expect(probe.value).toBe('a');
        act(() => vi.advanceTimersByTime(1));
        expect(probe.value).toBe('b');
        probe.unmount();
    });

    it('honors an explicit delay', () => {
        const probe = mountProbe('a', DEBOUNCE_MS.input);
        probe.set('b');

        act(() => vi.advanceTimersByTime(DEBOUNCE_MS.input));
        expect(probe.value).toBe('b');
        probe.unmount();
    });
});
