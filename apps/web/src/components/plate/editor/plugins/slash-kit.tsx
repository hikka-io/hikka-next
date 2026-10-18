import {
    type TriggerComboboxPluginOptions,
    withTriggerCombobox,
} from '@platejs/combobox';
import {
    createSlatePlugin,
    createTSlatePlugin,
    type PluginConfig,
} from 'platejs';
import { toPlatePlugin } from 'platejs/react';

import { SlashInputElement } from '@/components/plate/ui/slash-node';

import { SLASH_INPUT_KEY, SLASH_KEY } from './trigger-keys';

const BaseSlashInputPlugin = createSlatePlugin({
    key: SLASH_INPUT_KEY,
    node: { isElement: true, isInline: true, isVoid: true },
});

const BaseSlashPlugin = createTSlatePlugin<
    PluginConfig<'slash_command', TriggerComboboxPluginOptions>
>({
    key: SLASH_KEY,
    options: {
        trigger: '/',
        triggerPreviousCharPattern: /^\s?$/,
        createComboboxInput: (trigger) => ({
            children: [{ text: '' }],
            trigger,
            type: SLASH_INPUT_KEY,
        }),
    },
    plugins: [BaseSlashInputPlugin],
}).overrideEditor(withTriggerCombobox);

export const SlashKit = [
    toPlatePlugin(BaseSlashPlugin),
    toPlatePlugin(BaseSlashInputPlugin).withComponent(SlashInputElement),
];
