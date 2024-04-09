import { findAndReplace } from 'mdast-util-find-and-replace';

const userGroup = '[\\da-z][-\\da-z_]{0,38}';
const mentionRegex = new RegExp('(?:^|\\s)@(' + userGroup + ')', 'gi');

export default function remarkMentions(
    opts = { usernameLink: (username: string) => `/${username}` },
) {
    // @ts-ignore
    return (tree, _file) => {
        // @ts-ignore
        findAndReplace(tree, [[mentionRegex, replaceMention]]);
    };

    function replaceMention(value: string, username: string) {
        let whitespace = [];

        if (value.indexOf('@') > 0) {
            whitespace.push({
                type: 'text',
                value: value.substring(0, value.indexOf('@')),
            });
        }

        return [
            ...whitespace,
            {
                type: 'link',
                url: opts.usernameLink(username),
                children: [
                    { type: 'text', value: value.trim() }, // Trim the username here
                ],
            },
        ];
    }
}
