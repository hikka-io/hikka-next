import type { Link, Parent, PhrasingContent, Root } from 'mdast';
import { findAndReplace } from 'mdast-util-find-and-replace';

import { isUserReference, userUrlTarget } from '@/utils/mentions';

const userGroup = '[\\da-z][-\\da-z_]{0,38}';
const mentionRegex = new RegExp(`(?:^|\\s)@(${userGroup})`, 'gi');

const isParent = (node: unknown): node is Parent =>
    Array.isArray((node as Parent).children);

const linkLabel = (node: Parent): string =>
    node.children
        .map((child) => {
            if (child.type === 'text') return child.value;
            return isParent(child) ? linkLabel(child) : '';
        })
        .join('');

const asMention = (node: Link) => {
    const label = linkLabel(node);
    const target = userUrlTarget(node.url);

    if (!target || label[0] !== '@') return null;

    return isUserReference(target)
        ? { username: label.slice(1), reference: target }
        : { username: target };
};

function markMentionLinks(node: Parent) {
    for (const child of node.children) {
        if (child.type === 'link') {
            const mention = asMention(child);

            if (mention) {
                child.data = {
                    ...child.data,
                    hName: 'mention',
                    hProperties: mention,
                };
                continue;
            }
        }

        if (isParent(child)) markMentionLinks(child);
    }
}

export default function remarkMentions(
    opts = { usernameLink: (username: string) => `/${username}` },
) {
    return (tree: Root) => {
        markMentionLinks(tree);
        // A mention link already carries `@name` as its label; replacing that
        // text too would nest a second link inside it.
        findAndReplace(tree, [[mentionRegex, replaceMention]], {
            ignore: ['link', 'linkReference'],
        });
    };

    function replaceMention(
        value: string,
        username: string,
    ): PhrasingContent[] {
        const whitespace: PhrasingContent[] = [];

        if (value.indexOf('@') > 0) {
            whitespace.push({
                type: 'text',
                value: value.substring(0, value.indexOf('@')),
            });
        }

        const mention: Link = {
            type: 'link',
            url: opts.usernameLink(username),
            children: [{ type: 'text', value: value.trim() }],
            data: {
                hName: 'mention',
                hProperties: { username },
            },
        };

        return [...whitespace, mention];
    }
}
