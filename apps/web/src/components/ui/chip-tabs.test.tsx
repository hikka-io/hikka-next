import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ChipTabs } from './chip-tabs';

const OPTIONS = ['a', 'b', 'c'].map((value) => ({ label: value, value }));
const ROW_RIGHT = 100;

let activeRight = 160;
let container: HTMLDivElement;
let root: Root;

const rect = (right: number) => ({ left: right - 40, right }) as DOMRect;

beforeEach(() => {
    (
        globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
        function (this: Element) {
            return rect(
                this.getAttribute('aria-selected') === 'true'
                    ? activeRight
                    : ROW_RIGHT,
            );
        },
    );
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
});

const render = (value: string) =>
    act(() => root.render(<ChipTabs options={OPTIONS} value={value} />));

const row = () => container.querySelector<HTMLElement>('[role="tablist"]');

describe('ChipTabs', () => {
    it('scrolls an active chip past the right edge into view', () => {
        activeRight = 160;
        render('c');

        expect(row()?.scrollLeft).toBe(activeRight - ROW_RIGHT);
    });

    it('leaves the row alone when the active chip is visible', () => {
        activeRight = 60;
        render('a');

        expect(row()?.scrollLeft).toBe(0);
    });
});
