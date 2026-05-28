import type { Link, PhrasingContent, Root } from 'mdast';
import { findAndReplace } from 'mdast-util-find-and-replace';

const userGroup = '[\\da-z][-\\da-z_]{0,38}';
const mentionRegex = new RegExp('(?:^|\\s)@(' + userGroup + ')', 'gi');

export default function remarkMentions(
    opts = { usernameLink: (username: string) => `/${username}` },
) {
    return (tree: Root) => {
        findAndReplace(tree, [[mentionRegex, replaceMention]]);
    };

    function replaceMention(value: string, username: string): PhrasingContent[] {
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
