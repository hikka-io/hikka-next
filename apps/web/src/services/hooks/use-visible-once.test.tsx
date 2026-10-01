import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useVisibleOnce } from './use-visible-once';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];

    constructor(
        private callback: IntersectionObserverCallback,
        readonly options?: IntersectionObserverInit,
    ) {
        MockIntersectionObserver.instances.push(this);
    }

    readonly targets = new Set<Element>();

    observe(target: Element) {
        this.targets.add(target);
    }

    unobserve(target: Element) {
        this.targets.delete(target);
    }
    disconnect() {}

    emit(isIntersecting: boolean) {
        this.callback(
            [...this.targets].map(
                (target) =>
                    ({
                        target,
                        isIntersecting,
                        intersectionRatio: isIntersecting ? 1 : 0,
                    }) as IntersectionObserverEntry,
            ),
            this as unknown as IntersectionObserver,
        );
    }
}

const emit = async (isIntersecting: boolean) => {
    await act(async () => {
        for (const observer of MockIntersectionObserver.instances) {
            observer.emit(isIntersecting);
        }
    });
};

const Probe = ({ swapped = false }: { swapped?: boolean }) => {
    const { ref, visible } = useVisibleOnce();

    return swapped ? (
        <span ref={ref}>{String(visible)}</span>
    ) : (
        <div ref={ref}>{String(visible)}</div>
    );
};

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(async () => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    container = document.createElement('div');
    root = createRoot(container);
    await act(async () => root.render(<Probe />));
});

afterEach(async () => {
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
});

describe('useVisibleOnce', () => {
    it('is not visible before the element intersects', () => {
        expect(container.textContent).toBe('false');
    });

    it('observes with a 400px root margin', () => {
        expect(MockIntersectionObserver.instances[0]?.options).toMatchObject({
            rootMargin: '400px',
        });
    });

    it('turns visible on the first intersection', async () => {
        await emit(true);

        expect(container.textContent).toBe('true');
    });

    it('does not turn back after leaving the viewport', async () => {
        await emit(true);
        await emit(false);

        expect(container.textContent).toBe('true');
    });

    it('stops observing after the first intersection', async () => {
        await emit(true);

        expect(
            MockIntersectionObserver.instances.map(
                (observer) => observer.targets.size,
            ),
        ).toEqual(MockIntersectionObserver.instances.map(() => 0));
    });

    it('stays visible when the observed element is replaced', async () => {
        await emit(true);
        await act(async () => root.render(<Probe swapped />));
        await emit(false);

        expect(container.textContent).toBe('true');
    });
});
