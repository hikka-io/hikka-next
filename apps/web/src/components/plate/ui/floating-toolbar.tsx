import type * as React from 'react';

import {
    flip,
    getSelectionBoundingClientRect,
    mergeClientRects,
    offset,
    useFloatingToolbar,
    useFloatingToolbarState,
} from '@platejs/floating';
import { KEYS } from 'platejs';
import {
    type PlateEditor,
    useComposedRef,
    useEditorId,
    useEditorRef,
    useEventEditorValue,
    usePluginOption,
} from 'platejs/react';

import { cn } from '@/utils/cn';

import { Toolbar } from './toolbar';

const FLOATING_OPTIONS = {
    middleware: [
        offset(8),
        flip({
            fallbackPlacements: ['top-start', 'top-end', 'bottom-start'],
            padding: 12,
        }),
    ],
    placement: 'top' as const,
};

// Anchors to the first selected line: a selection running over blank lines spans their whole height.
function firstLineRect(editor: PlateEditor) {
    const range =
        editor.selection && editor.api.isExpanded()
            ? editor.api.toDOMRange(editor.selection)
            : undefined;
    const rects = [...(range?.getClientRects() ?? [])]
        .filter((rect) => rect.width > 1)
        .sort((a, b) => a.top - b.top);

    if (rects.length === 0) return getSelectionBoundingClientRect(editor);

    return mergeClientRects(rects.filter((rect) => rect.top < rects[0].bottom));
}

export function FloatingToolbar({
    children,
    className,
    ref: refProp,
    ...props
}: React.ComponentProps<typeof Toolbar>) {
    const editor = useEditorRef();
    const editorId = useEditorId();
    const focusedEditorId = useEventEditorValue('focus');
    const isLinkEditing = !!usePluginOption({ key: KEYS.link }, 'mode');

    const state = useFloatingToolbarState({
        editorId,
        focusedEditorId,
        hideToolbar: isLinkEditing,
        floatingOptions: {
            ...FLOATING_OPTIONS,
            getBoundingClientRect: () => firstLineRect(editor),
        },
    });
    const {
        clickOutsideRef,
        hidden,
        props: rootProps,
        ref: floatingRef,
    } = useFloatingToolbar(state);
    const ref = useComposedRef<HTMLDivElement>(refProp, floatingRef);

    if (hidden) return null;

    return (
        <div ref={clickOutsideRef}>
            <Toolbar
                {...props}
                {...rootProps}
                ref={ref}
                className={cn(
                    'absolute z-50 gap-0.5 whitespace-nowrap rounded-lg bg-popover p-1 shadow-md ring-1 ring-border',
                    className,
                )}
            >
                {children}
            </Toolbar>
        </div>
    );
}
