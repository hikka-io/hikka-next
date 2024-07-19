import { findAndReplace } from 'mdast-util-find-and-replace';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import useUser from '@/services/hooks/user/use-user';

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

        const { data: user } = useUser({ username });

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
                    {
                        value: (
                            <span className="inline-flex items-baseline gap-1">
                                <Avatar className="size-5 self-center">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback>
                                        {username[0]}
                                    </AvatarFallback>
                                </Avatar>
                                {value.trim()}
                            </span>
                        ),
                    },
                ],
            },
        ];
    }
}
