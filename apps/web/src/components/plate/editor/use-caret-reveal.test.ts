import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { revealCaret } from './use-caret-reveal';

const HEADER_PADDING = 64;
const TOOLBAR_TOP = 300;

const rect = (top: number, bottom: number) =>
    ({ top, bottom, height: bottom - top }) as DOMRect;

const caretAt = (top: number, bottom: number) =>
    ({
        cloneRange: () => ({
            collapse: () => {},
            getBoundingClientRect: () => rect(top, bottom),
            startContainer: document.body,
        }),
    }) as unknown as Range;

const toolbar = {
    getBoundingClientRect: () => rect(TOOLBAR_TOP, TOOLBAR_TOP + 88),
} as Element;

let scrollBy: ReturnType<typeof vi.fn>;

beforeEach(() => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        scrollPaddingTop: `${HEADER_PADDING}px`,
    } as CSSStyleDeclaration);
    scrollBy = vi.fn();
    vi.stubGlobal('scrollBy', scrollBy);
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('revealCaret', () => {
    it('leaves a caret between the header and the toolbar alone', () => {
        revealCaret(caretAt(200, 220), toolbar);

        expect(scrollBy).not.toHaveBeenCalled();
    });

    it('scrolls a caret out from under the header', () => {
        revealCaret(caretAt(40, 60), toolbar);

        expect(scrollBy).toHaveBeenCalledWith(0, 40 - HEADER_PADDING);
    });

    it('scrolls a caret up from behind the toolbar', () => {
        revealCaret(caretAt(290, 310), toolbar);

        expect(scrollBy).toHaveBeenCalledWith(0, 310 - (TOOLBAR_TOP - 16));
    });
});
