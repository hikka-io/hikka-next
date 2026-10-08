import { act } from 'react';
import { createRoot } from 'react-dom/client';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useVisible } from './use-visible';

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

    private targets = new Set<Element>();

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

const Probe = () => {
    const { ref, visible } = useVisible();

    return <div ref={ref}>{String(visible)}</div>;
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

describe('useVisible', () => {
    it('is not visible before the element intersects', () => {
        expect(container.textContent).toBe('false');
    });

    it('observes with a 400px root margin', () => {
        expect(MockIntersectionObserver.instances[0]?.options).toMatchObject({
            rootMargin: '400px',
        });
    });

    it('turns visible on intersection and hidden again on leaving', async () => {
        await emit(true);
        expect(container.textContent).toBe('true');

        await emit(false);
        expect(container.textContent).toBe('false');
    });
});
