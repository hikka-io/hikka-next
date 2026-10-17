import { type RefObject, useEffect, useEffectEvent } from 'react';

/**
 * Handlers keyed by `KeyboardEvent.code` with `Mod+` and `Shift+` prefixes, so any layout works.
 * A handler returns `false` to leave the key to the browser.
 */
export type GraphKeys = Partial<Record<string, () => unknown>>;

const isEditable = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    (target.isContentEditable ||
        target.closest('input, textarea, select, [role="textbox"]') !== null);

/** Keys pressed inside `root`, or with nothing focused. */
export function useGraphKeys(
    rootRef: RefObject<HTMLElement | null>,
    keys: GraphKeys,
) {
    const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
        const { target } = event;
        const inGraph =
            target === document.body ||
            (target instanceof Node && rootRef.current?.contains(target));
        if (!inGraph || event.altKey || isEditable(target)) return;

        const mod = event.ctrlKey || event.metaKey ? 'Mod+' : '';
        const shift = event.shiftKey ? 'Shift+' : '';
        const handler = keys[`${mod}${shift}${event.code}`];
        if (handler && handler() !== false) event.preventDefault();
    });

    useEffect(() => {
        // Capture, because the dialog's portal stops keys from bubbling to the document.
        document.addEventListener('keydown', onKeyDown, true);
        return () => document.removeEventListener('keydown', onKeyDown, true);
    }, []);
}
