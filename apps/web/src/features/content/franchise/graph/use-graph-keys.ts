import { useEffect, useEffectEvent } from 'react';

/** Handlers keyed by `KeyboardEvent.code` with `Mod+` and `Shift+` prefixes, so any layout works. */
export type GraphKeys = Partial<Record<string, () => void>>;

const isEditable = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    (target.isContentEditable ||
        target.closest('input, textarea, select, [role="textbox"]') !== null);

export function useGraphKeys(keys: GraphKeys) {
    const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
        if (
            event.defaultPrevented ||
            event.altKey ||
            isEditable(event.target)
        ) {
            return;
        }

        const mod = event.ctrlKey || event.metaKey ? 'Mod+' : '';
        const shift = event.shiftKey ? 'Shift+' : '';
        const handler = keys[`${mod}${shift}${event.code}`];
        if (!handler) return;

        event.preventDefault();
        handler();
    });

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);
}
