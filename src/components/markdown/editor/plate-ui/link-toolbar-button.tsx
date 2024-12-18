'use client';

import { withRef } from '@udecode/cn';
import {
    useLinkToolbarButton,
    useLinkToolbarButtonState,
} from '@udecode/plate-link/react';
import { Link } from 'lucide-react';

import { ToolbarButton } from './toolbar';

export const LinkToolbarButton = withRef<typeof ToolbarButton>((rest, ref) => {
    const state = useLinkToolbarButtonState();
    const { props } = useLinkToolbarButton(state);

    return (
        <ToolbarButton
            ref={ref}
            data-plate-focus
            tooltip="Посилання (⌘+K)"
            {...props}
            {...rest}
        >
            <Link />
        </ToolbarButton>
    );
});
