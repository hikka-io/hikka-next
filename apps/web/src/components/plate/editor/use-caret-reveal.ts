import { type RefObject, useEffect } from 'react';

import { RangeApi, type TRange } from 'platejs';

const KEYBOARD_SETTLE_MS = 500;
const CARET_MARGIN = 16;

const caretRect = (caret: Range) => {
    const rect = caret.getBoundingClientRect();

    return rect.height > 0
        ? rect
        : caret.startContainer.parentElement?.getBoundingClientRect();
};

/**
 * Scrolls a collapsed caret between the fixed header and the docked toolbar. The toolbar is pinned
 * to the visible bottom, so the visible area is measured from it, in the caret's own coordinates.
 */
export function revealCaret(caret: Range, toolbar: Element | null) {
    const viewport = window.visualViewport;
    const rect = caretRect(caret);
    if (!viewport || !toolbar || !rect) return;

    const toolbarRect = toolbar.getBoundingClientRect();
    const top =
        toolbarRect.bottom -
        viewport.height +
        Number.parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
        );
    const bottom = toolbarRect.top - CARET_MARGIN;

    if (rect.top < top) window.scrollBy(0, rect.top - top);
    else if (rect.bottom > bottom) window.scrollBy(0, rect.bottom - bottom);
}

/** Slate's `scrollSelectionIntoView`; like its default, it follows the focus end of the selection. */
export function revealSelection(
    editor: { selection: TRange | null },
    range: Range,
    toolbar: Element | null,
) {
    const focus = range.cloneRange();
    focus.collapse(!!editor.selection && RangeApi.isBackward(editor.selection));
    revealCaret(focus, toolbar);
}

/** iOS scrolls the page on its own while the keyboard opens, ignoring the fixed bars, so the caret is revealed again once that settles. */
export function useCaretReveal(
    toolbarRef: RefObject<HTMLElement | null>,
    enabled: boolean,
) {
    useEffect(() => {
        const viewport = window.visualViewport;
        if (!enabled || !viewport) return;

        let lastHeight = viewport.height;
        let settleUntil = 0;
        let rafId = 0;

        const reveal = () => {
            rafId = 0;
            const selection = document.getSelection();
            if (
                !selection?.focusNode ||
                !document.activeElement?.closest('[data-slate-editor]')
            ) {
                return;
            }
            const focus = document.createRange();
            focus.setStart(selection.focusNode, selection.focusOffset);
            revealCaret(focus, toolbarRef.current);
        };

        const schedule = () => {
            if (!rafId) rafId = requestAnimationFrame(reveal);
        };

        const onResize = () => {
            const opening = viewport.height < lastHeight;
            lastHeight = viewport.height;
            if (!opening) return;

            settleUntil = performance.now() + KEYBOARD_SETTLE_MS;
            schedule();
        };

        const onScroll = () => {
            if (performance.now() < settleUntil) schedule();
        };

        viewport.addEventListener('resize', onResize);
        viewport.addEventListener('scroll', onScroll);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            viewport.removeEventListener('resize', onResize);
            viewport.removeEventListener('scroll', onScroll);
        };
    }, [toolbarRef, enabled]);
}
