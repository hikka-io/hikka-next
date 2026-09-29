import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useIsDesktop } from './use-media-query';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Listener = (event: MediaQueryListEvent) => void;

function mockMatchMedia(matches: boolean) {
    const listeners = new Set<Listener>();
    const queries: string[] = [];

    vi.stubGlobal('matchMedia', (query: string) => {
        queries.push(query);

        return {
            matches,
            addEventListener: (_: string, listener: Listener) =>
                listeners.add(listener),
            removeEventListener: (_: string, listener: Listener) =>
                listeners.delete(listener),
        };
    });

    return {
        queries,
        emit: (next: boolean) => {
            for (const listener of listeners) {
                listener({ matches: next } as MediaQueryListEvent);
            }
        },
    };
}

function mountProbe() {
    let latest: boolean | undefined;
    const Probe = () => {
        latest = useIsDesktop();
        return null;
    };
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => root.render(<Probe />));

    return {
        get value() {
            return latest;
        },
        unmount: () => act(() => root.unmount()),
    };
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('useIsDesktop', () => {
    it('queries the md breakpoint', () => {
        const media = mockMatchMedia(true);
        const probe = mountProbe();

        expect(media.queries).toEqual(['(min-width: 768px)']);
        expect(probe.value).toBe(true);
        probe.unmount();
    });

    it('follows the media query changes', () => {
        const media = mockMatchMedia(false);
        const probe = mountProbe();

        expect(probe.value).toBe(false);
        act(() => media.emit(true));
        expect(probe.value).toBe(true);
        probe.unmount();
    });
});
