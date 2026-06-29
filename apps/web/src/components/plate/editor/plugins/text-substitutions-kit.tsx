import { createSlatePlugin, createTextSubstitutionInputRule } from 'platejs';

// Text substitutions previously provided by the deprecated @platejs/autoformat
// presets (smart quotes, punctuation, legal symbols, arrows). Markdown-style
// mark/block autoformatting now lives as feature-owned input rules in
// basic-marks-kit, basic-blocks-kit and headings-kit.
const SUBSTITUTION_PATTERNS = [
    // Smart quotes
    { format: ['“', '”'], match: '"' },
    { format: ['‘', '’'], match: "'" },
    // Punctuation
    { format: '—', match: '--' },
    { format: '…', match: '...' },
    { format: '»', match: '>>' },
    { format: '«', match: '<<' },
    // Legal symbols
    { format: '™', match: ['(tm)', '(TM)', '&trade;'] },
    { format: '®', match: ['(r)', '(R)', '&reg;'] },
    { format: '©', match: ['(c)', '(C)', '&copy;'] },
    { format: '§', match: '&sect;' },
    // Arrows
    { format: '→', match: '->' },
    { format: '←', match: '<-' },
    { format: '⇒', match: '=>' },
    { format: '⇐', match: ['<=', '≤='] },
] satisfies Parameters<typeof createTextSubstitutionInputRule>[0]['patterns'];

// Note: the key must NOT be 'autoformat' — v53 core treats that key as the
// deprecated @platejs/autoformat plugin and throws when input rules exist.
export const TextSubstitutionsPlugin = createSlatePlugin({
    key: 'text_substitutions',
    inputRules: [
        createTextSubstitutionInputRule({ patterns: SUBSTITUTION_PATTERNS }),
    ],
});

export const TextSubstitutionsKit = [TextSubstitutionsPlugin];
