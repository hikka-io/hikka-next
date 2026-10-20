import type { FC } from 'react';

import type { Href } from 'expo-router';
import { View } from 'react-native';

import type { UserResponse, UserRoleEnum } from '@hikka/api';
import { APP_LOCALE_TAG, USER_ROLE } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Badge } from '@/components/ui/badge';

const STAFF_ROLES = new Set<string>(['admin', 'moderator']);

const JOINED_FORMAT = new Intl.DateTimeFormat(APP_LOCALE_TAG, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

type Props = {
    user: UserResponse;
};

/** The web's `UserCard`: avatar, username with an online dot, staff role and join date. */
const UserResultRow: FC<Props> = ({ user }) => {
    return (
        <HorizontalCard
            href={`/u/${user.username}` as Href}
            className="px-4 py-2"
        >
            <HorizontalCardImage
                image={user.avatar}
                imageRatio={1}
                imageClassName="rounded-full"
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle
                    titleMeta={
                        user.active ? (
                            <View
                                accessibilityLabel="Онлайн"
                                className="size-2 rounded-full bg-success-foreground"
                            />
                        ) : null
                    }
                >
                    {user.username}
                </HorizontalCardTitle>
                <HorizontalCardDescription>
                    {STAFF_ROLES.has(user.role) ? (
                        <Badge variant="secondary">
                            {USER_ROLE[user.role as UserRoleEnum].label}
                        </Badge>
                    ) : null}
                    {JOINED_FORMAT.format(new Date(user.created * 1000))}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default UserResultRow;
