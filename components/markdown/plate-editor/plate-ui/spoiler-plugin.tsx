import {
    createPluginFactory,
    onKeyDownToggleElement,
} from '@udecode/plate-common';

export const ELEMENT_SPOILER = 'spoiler';

export const createSpoilerPlugin = createPluginFactory({
    key: ELEMENT_SPOILER,
    deserializeHtml: {
        rules: [
            {
                validNodeName: 'DIV',
                validClassName: 'spoiler',
            },
        ],
    },
    isElement: true,
    handlers: {
        onKeyDown: onKeyDownToggleElement,
    },
    options: {
        hotkey: ['mod+opt+s', 'mod+shift+s'],
    },
});
