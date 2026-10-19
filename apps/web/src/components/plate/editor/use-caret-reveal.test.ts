import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { revealCaret } from './use-caret-reveal';

const VIEWPORT_HEIGHT = 385;
const TOOLBAR_BOTTOM = 100;

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

const toolbar = { getBoundingClientRect: () => rect(60, TOOLBAR_BOTTOM) };

let scrollBy: ReturnType<typeof vi.fn>;

beforeEach(() => {
    vi.stubGlobal('visualViewport', { height: VIEWPORT_HEIGHT, offsetTop: 0 });
    scrollBy = vi.fn();
    vi.stubGlobal('scrollBy', scrollBy);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('revealCaret', () => {
    it('leaves a caret in the visible band alone', () => {
        revealCaret(caretAt(200, 220), toolbar as Element);

        expect(scrollBy).not.toHaveBeenCalled();
    });

    it('scrolls a caret out from under the toolbar', () => {
        revealCaret(caretAt(90, 110), toolbar as Element);

        expect(scrollBy).toHaveBeenCalledWith(0, 90 - (TOOLBAR_BOTTOM + 16));
    });

    it('scrolls a caret up from behind the keyboard', () => {
        revealCaret(caretAt(380, 400), toolbar as Element);

        expect(scrollBy).toHaveBeenCalledWith(0, 400 - (VIEWPORT_HEIGHT - 16));
    });
});
