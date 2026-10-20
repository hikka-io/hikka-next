import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { type Href, Link, useIsFocused } from 'expo-router';
import { Pressable, View } from 'react-native';

import { parseUserLinks, type UserResponseFollowed } from '@hikka/api';
import { getUserLinkLabel } from '@hikka/core';

import { MDViewer } from '@/components/markdown';
import { useOpenLink } from '@/components/markdown/use-open-link';
import TextExpand from '@/components/text-expand';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import Image from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { sizedImageUrl } from '@/utils/image-presets';

import FollowButton from './follow/follow-button';
import { followStatsOptions } from './queries';
import RoleBadge from './role-badge';
import { followListHref } from './user-hrefs';

// The widest phone screen, in points.
const COVER_WIDTH = 440;
const DESCRIPTION_CLASS = 'text-sm leading-5 text-muted-foreground';

type Props = {
    user: UserResponseFollowed;
    username: string;
};

const FollowCount: FC<{ count?: number; label: string; href: Href }> = ({
    count,
    label,
    href,
}) => (
    <Link href={href} asChild>
        <Pressable
            accessibilityRole="link"
            accessibilityLabel={`${count ?? ''} ${label}`}
            className="min-h-11 items-start justify-center active:opacity-70"
        >
            <Text
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                className="font-bold text-base tabular-nums"
            >
                {count ?? '–'}
            </Text>
            <Text
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                className="text-muted-foreground text-xs"
            >
                {label}
            </Text>
        </Pressable>
    </Link>
);

const ProfileHeader: FC<Props> = ({ user, username }) => {
    const openLink = useOpenLink();
    const { data: follow } = useQuery({
        ...followStatsOptions({ path: { username } }),
        subscribed: useIsFocused(),
    });
    const links = parseUserLinks(user.links);

    return (
        <View>
            {user.cover ? (
                <View className="h-36 w-full bg-muted">
                    <Image
                        source={sizedImageUrl(user.cover, COVER_WIDTH)}
                        contentFit="cover"
                        accessibilityIgnoresInvertColors
                        className="size-full"
                    />
                </View>
            ) : null}
            <View className="gap-4 px-4">
                <View
                    className={`flex-row items-end gap-4 ${user.cover ? '-mt-10' : 'mt-4'}`}
                >
                    <View>
                        <Avatar className="size-24 border-4 border-background">
                            <AvatarImage
                                src={user.avatar}
                                alt={username}
                                size={96}
                            />
                            <AvatarFallback>
                                {username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {user.active && (
                            <View
                                accessibilityLabel="Зараз онлайн"
                                className="absolute right-0 bottom-0 size-6 rounded-full border-4 border-background bg-success-foreground"
                            />
                        )}
                    </View>
                    <View className="flex-1 flex-row gap-6">
                        <FollowCount
                            count={follow?.followers}
                            label="стежать"
                            href={followListHref(username, 'followers')}
                        />
                        <FollowCount
                            count={follow?.following}
                            label="відстежується"
                            href={followListHref(username, 'followings')}
                        />
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    <Text
                        accessibilityRole="header"
                        numberOfLines={1}
                        className="min-w-0 shrink font-bold text-2xl leading-8"
                    >
                        {username}
                    </Text>
                    <RoleBadge role={user.role} />
                </View>
                {user.description ? (
                    <TextExpand
                        contentKey={user.reference}
                        lines={3}
                        textClassName={DESCRIPTION_CLASS}
                        expandLabel="Показати повний опис"
                    >
                        <MDViewer
                            key={user.reference}
                            textClassName={DESCRIPTION_CLASS}
                        >
                            {user.description}
                        </MDViewer>
                    </TextExpand>
                ) : null}
                <FollowButton
                    user={user}
                    containerClassName="self-stretch"
                    className="w-full"
                />
                {links.length > 0 && (
                    <View className="-mx-4">
                        <LinkChips
                            links={links}
                            onOpen={(url) => openLink(url)}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

type LinkChipsProps = {
    links: ReturnType<typeof parseUserLinks>;
    onOpen: (url: string) => void;
};

const LinkChips: FC<LinkChipsProps> = ({ links, onOpen }) => (
    <View className="flex-row flex-wrap gap-2 px-4">
        {links.map((link) => (
            <Chip
                key={link.url}
                accessibilityRole="link"
                className="bg-secondary"
                onPress={() => onOpen(link.url)}
            >
                {getUserLinkLabel(link)}
            </Chip>
        ))}
    </View>
);

export default ProfileHeader;
