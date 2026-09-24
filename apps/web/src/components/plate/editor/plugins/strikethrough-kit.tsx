import { StrikethroughRules } from '@platejs/basic-nodes';
import { StrikethroughPlugin } from '@platejs/basic-nodes/react';

export const StrikethroughKit = [
    StrikethroughPlugin.configure({
        inputRules: [StrikethroughRules.markdown()],
    }),
];
