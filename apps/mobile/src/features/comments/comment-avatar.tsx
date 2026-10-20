import type { FC } from 'react';

import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { UserResponse } from '@hikka/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
    author: UserResponse;
};

/** The 40 pt avatar in a 44 pt link, like the feed's author column. */
const CommentAvatar: FC<Props> = ({ author }) => {
    const avatar = (
        <Avatar className="size-10 rounded-lg">
            <AvatarImage src={author.avatar} size={40} />
            <AvatarFallback className="rounded-lg">
                {author.username?.[0]}
            </AvatarFallback>
        </Avatar>
    );

    if (!author.username) {
        return <View className="-m-0.5 size-11 items-center">{avatar}</View>;
    }

    return (
        <Link href={`/u/${author.username}`} asChild>
            <Pressable
                accessibilityRole="link"
                accessibilityLabel={author.username}
                className="-m-0.5 size-11 items-center active:opacity-70"
            >
                {avatar}
            </Pressable>
        </Link>
    );
};

export default CommentAvatar;
