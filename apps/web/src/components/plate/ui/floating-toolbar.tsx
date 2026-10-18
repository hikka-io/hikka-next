import type * as React from 'react';

import {
    flip,
    offset,
    useFloatingToolbar,
    useFloatingToolbarState,
} from '@platejs/floating';
import { KEYS } from 'platejs';
import {
    useComposedRef,
    useEditorId,
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

export function FloatingToolbar({
    children,
    className,
    ref: refProp,
    ...props
}: React.ComponentProps<typeof Toolbar>) {
    const editorId = useEditorId();
    const focusedEditorId = useEventEditorValue('focus');
    const isLinkEditing = !!usePluginOption({ key: KEYS.link }, 'mode');

    const state = useFloatingToolbarState({
        editorId,
        focusedEditorId,
        hideToolbar: isLinkEditing,
        floatingOptions: FLOATING_OPTIONS,
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
