import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    revealCaret,
    revealSelection,
    useCaretReveal,
} from './use-caret-reveal';

const HEADER_PADDING = 64;
const VIEWPORT_HEIGHT = 385;
const TOOLBAR_TOP = 300;
const TOOLBAR_BOTTOM = 388;
const VISIBLE_TOP = TOOLBAR_BOTTOM - VIEWPORT_HEIGHT;

const rect = (top: number, bottom: number) =>
    ({ top, bottom, height: bottom - top }) as DOMRect;

const caretAt = (top: number, bottom: number) =>
    ({
        getBoundingClientRect: () => rect(top, bottom),
        startContainer: document.body,
    }) as unknown as Range;

const toolbar = {
    getBoundingClientRect: () => rect(TOOLBAR_TOP, TOOLBAR_BOTTOM),
} as Element;

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let scrollBy: ReturnType<typeof vi.fn>;
let viewport: EventTarget & { height: number };

beforeEach(() => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        scrollPaddingTop: `${HEADER_PADDING}px`,
    } as CSSStyleDeclaration);
    viewport = Object.assign(new EventTarget(), { height: VIEWPORT_HEIGHT });
    vi.stubGlobal('visualViewport', viewport);
    scrollBy = vi.fn();
    vi.stubGlobal('scrollBy', scrollBy);
});

afterEach(() => {
    act(() => root?.unmount());
    root = undefined;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
});

describe('revealCaret', () => {
    it('leaves a caret between the header and the toolbar alone', () => {
        revealCaret(caretAt(200, 220), toolbar);

        expect(scrollBy).not.toHaveBeenCalled();
    });

    it('measures the header edge from the toolbar pinned to the visible bottom', () => {
        revealCaret(caretAt(40, 60), toolbar);

        expect(scrollBy).toHaveBeenCalledWith(
            0,
            40 - (VISIBLE_TOP + HEADER_PADDING),
        );
    });

    it('scrolls a caret up from behind the toolbar', () => {
        revealCaret(caretAt(290, 310), toolbar);

        expect(scrollBy).toHaveBeenCalledWith(0, 310 - (TOOLBAR_TOP - 16));
    });

    const emptyCaretIn = (container: Element, offset = 0) =>
        ({
            getBoundingClientRect: () => rect(0, 0),
            startContainer: container,
            startOffset: offset,
        }) as unknown as Range;

    it('measures the block an empty-line caret sits in', () => {
        const block = document.createElement('p');
        block.getBoundingClientRect = () => rect(290, 310);
        const parent = document.createElement('div');
        parent.append(block);

        revealCaret(emptyCaretIn(parent), toolbar);

        expect(scrollBy).toHaveBeenCalledWith(0, 310 - (TOOLBAR_TOP - 16));
    });

    it('never measures the whole editor', () => {
        const editor = document.createElement('div');
        editor.setAttribute('data-slate-editor', 'true');
        editor.getBoundingClientRect = () => rect(-500, 2000);

        revealCaret(emptyCaretIn(editor, 3), toolbar);

        expect(scrollBy).not.toHaveBeenCalled();
    });
});

describe('revealSelection', () => {
    const domRange = (backwardEndTop: number, forwardEndTop: number) => {
        const collapse = vi.fn((toStart: boolean) => {
            const top = toStart ? backwardEndTop : forwardEndTop;
            Object.assign(clone, caretAt(top, top + 20));
        });
        const clone = { collapse } as unknown as Range;
        return { cloneRange: () => clone } as unknown as Range;
    };

    const point = (offset: number) => ({ path: [0, 0], offset });

    it('follows the start of a backward selection', () => {
        revealSelection(
            { selection: { anchor: point(5), focus: point(0) } },
            domRange(40, 200),
            toolbar,
        );

        expect(scrollBy).toHaveBeenCalled();
    });

    it('follows the end of a forward selection', () => {
        revealSelection(
            { selection: { anchor: point(0), focus: point(5) } },
            domRange(40, 200),
            toolbar,
        );

        expect(scrollBy).not.toHaveBeenCalled();
    });
});

describe('useCaretReveal', () => {
    const focusEditor = () => {
        const editor = document.createElement('div');
        editor.setAttribute('data-slate-editor', 'true');
        editor.contentEditable = 'true';
        editor.tabIndex = 0;
        editor.textContent = 'text';
        document.body.append(editor);
        editor.focus();
        document.getSelection()?.collapse(editor.firstChild, 2);
    };

    const resizeTo = (height: number) => {
        viewport.height = height;
        viewport.dispatchEvent(new Event('resize'));
    };

    beforeEach(() => {
        vi.stubGlobal('requestAnimationFrame', (run: FrameRequestCallback) => {
            run(0);
            return 1;
        });
        Range.prototype.getBoundingClientRect = () => rect(40, 60);
        focusEditor();
    });

    afterEach(() => {
        delete (Range.prototype as Partial<Range>).getBoundingClientRect;
    });

    const Reveal = () => {
        useCaretReveal({ current: toolbar as HTMLElement }, true);
        return null;
    };

    const renderReveal = () => {
        const container = document.createElement('div');
        document.body.append(container);
        root = createRoot(container);
        act(() => root?.render(createElement(Reveal)));
    };

    it('reveals the caret when the keyboard opens', () => {
        renderReveal();

        resizeTo(200);

        expect(scrollBy).toHaveBeenCalled();
    });

    it('ignores the viewport growing back', () => {
        viewport.height = 200;
        renderReveal();

        resizeTo(VIEWPORT_HEIGHT);
        viewport.dispatchEvent(new Event('scroll'));

        expect(scrollBy).not.toHaveBeenCalled();
    });
});
