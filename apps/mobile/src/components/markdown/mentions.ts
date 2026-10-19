import type { Token, TokenizerExtension, Tokens } from 'marked';

import { API_LIMITS } from '@hikka/api';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUserReference = (value: string) => UUID.test(value);

const USER_URL = /^(?:https?:\/\/[^\s/()]+)?\/u\/([A-Za-z0-9_-]+)$/;

export const userUrlTarget = (url: string) => USER_URL.exec(url)?.[1] ?? null;

const { min, max } = API_LIMITS.username;
const MENTION = new RegExp(
    `^@([a-z][\\da-z_]{${min - 1},${max - 1}})(?![-\\da-z_])`,
    'i',
);

export type MentionToken = {
    type: 'mention';
    raw: string;
    username: string;
    reference?: string;
};

export const mentionInline: TokenizerExtension = {
    name: 'mention',
    level: 'inline',
    start: (src) => {
        const index = src.indexOf('@');

        return index === -1 ? undefined : index;
    },
    tokenizer(src) {
        if (this.lexer.state.inLink) return undefined;

        const match = MENTION.exec(src);

        if (!match) return undefined;

        return {
            type: 'mention',
            raw: match[0],
            username: match[1],
        } satisfies MentionToken;
    },
};

const labelOf = (tokens: Token[] | undefined): string =>
    (tokens ?? [])
        .map((token) => {
            if (token.type === 'text') return token.text;

            return 'tokens' in token ? labelOf(token.tokens) : '';
        })
        .join('');

export const asMention = (
    link: Tokens.Link,
): Pick<MentionToken, 'username' | 'reference'> | null => {
    const label = labelOf(link.tokens);
    const target = userUrlTarget(link.href);

    if (!target || label[0] !== '@') return null;

    return isUserReference(target)
        ? { username: label.slice(1), reference: target }
        : { username: target };
};
