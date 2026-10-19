import { type RefObject, useEffect } from 'react';

const KEYBOARD_SETTLE_MS = 500;
const CARET_MARGIN = 16;

const caretRect = (range: Range) => {
    const caret = range.cloneRange();
    caret.collapse(false);
    const rect = caret.getBoundingClientRect();

    return rect.height > 0
        ? rect
        : caret.startContainer.parentElement?.getBoundingClientRect();
};

/**
 * Scrolls the caret between the fixed header and the docked toolbar. Rects are measured against
 * the visible area here: iOS reports them that way while the keyboard is open, and other browsers
 * keep the visible area at the top of the layout viewport.
 */
export function revealCaret(range: Range, toolbar: Element | null) {
    const rect = caretRect(range);
    if (!toolbar || !rect) return;

    const top = Number.parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
    );
    const bottom = toolbar.getBoundingClientRect().top - CARET_MARGIN;

    if (rect.top < top) window.scrollBy(0, rect.top - top);
    else if (rect.bottom > bottom) window.scrollBy(0, rect.bottom - bottom);
}

/** iOS scrolls the page on its own while the keyboard opens, ignoring the fixed bars, so the caret is revealed again once that settles. */
export function useCaretReveal(
    toolbarRef: RefObject<HTMLElement | null>,
    enabled: boolean,
) {
    useEffect(() => {
        const viewport = window.visualViewport;
        if (!enabled || !viewport) return;

        let settleUntil = 0;
        let rafId = 0;

        const reveal = () => {
            rafId = 0;
            const selection = document.getSelection();
            if (
                !selection?.rangeCount ||
                !document.activeElement?.closest('[data-slate-editor]')
            ) {
                return;
            }
            revealCaret(selection.getRangeAt(0), toolbarRef.current);
        };

        const schedule = () => {
            if (!rafId) rafId = requestAnimationFrame(reveal);
        };

        const onResize = () => {
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
