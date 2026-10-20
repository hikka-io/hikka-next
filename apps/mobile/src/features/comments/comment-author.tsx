import type { FC } from 'react';

import { Link } from 'expo-router';
import { Shield, ShieldCheck } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import type { UserResponse } from '@hikka/api';
import { formatTimeAgo, USER_ROLE } from '@hikka/core';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

const ROLE = {
    admin: { glyph: ShieldCheck, className: 'text-role-admin' },
    moderator: { glyph: Shield, className: 'text-role-moderator' },
} as const;

type Props = {
    author: UserResponse;
    created: number;
    className?: string;
};

/** The web's `AuthorMetaRow`: username tinted by staff role, role glyph, relative time. */
const CommentAuthor: FC<Props> = ({ author, created, className }) => {
    const role =
        author.role === 'admin' || author.role === 'moderator'
            ? author.role
            : undefined;

    return (
        <View className={cn('min-w-0 flex-row items-center gap-2', className)}>
            {author.username ? (
                <Link href={`/u/${author.username}`} asChild>
                    <Pressable
                        accessibilityRole="link"
                        className="-my-3 min-h-11 shrink justify-center active:opacity-70"
                    >
                        <Text
                            numberOfLines={1}
                            className={cn(
                                'font-semibold text-sm',
                                role && ROLE[role].className,
                            )}
                        >
                            {author.username}
                        </Text>
                    </Pressable>
                </Link>
            ) : (
                <Text
                    numberOfLines={1}
                    className="shrink font-semibold text-muted-foreground text-sm"
                >
                    Видалений користувач
                </Text>
            )}
            {role && (
                <View accessible accessibilityLabel={USER_ROLE[role].label}>
                    <Icon
                        as={ROLE[role].glyph}
                        className={cn('size-4', ROLE[role].className)}
                    />
                </View>
            )}
            <View className="size-1 rounded-full bg-muted-foreground" />
            <Text
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                className="shrink-0 text-muted-foreground text-xs"
            >
                {formatTimeAgo(created, Date.now())}
            </Text>
        </View>
    );
};

export default CommentAuthor;
