import {
    useLinkToolbarButton,
    useLinkToolbarButtonState,
} from '@udecode/plate-link';
import MaterialSymbolsLinkRounded from '~icons/material-symbols/link-rounded';

import { withRef } from '@/utils/utils';

import { ToolbarButton } from './toolbar';

export const LinkToolbarButton = withRef<typeof ToolbarButton>((rest, ref) => {
    const state = useLinkToolbarButtonState();
    const { props } = useLinkToolbarButton(state);

    return (
        <ToolbarButton ref={ref} tooltip="Посилання" {...props} {...rest}>
            <MaterialSymbolsLinkRounded />
        </ToolbarButton>
    );
});
