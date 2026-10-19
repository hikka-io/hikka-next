import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { userProfileOptions, userReferenceOptions } from '@hikka/api';

import { useOpenLink } from './use-open-link';

type Props = {
    username: string;
    reference?: string;
};

const AVATAR_SIZE = 20;

const useMentionUser = (username: string, reference?: string) => {
    const { data: referencedUser } = useQuery({
        ...userReferenceOptions({ path: { reference: reference ?? '' } }),
        enabled: !!reference,
    });

    const { data: profile } = useQuery({
        ...userProfileOptions({ path: { username } }),
        enabled: !reference && !!username,
    });

    return referencedUser ?? profile;
};

const Mention: FC<Props> = ({ username: storedUsername, reference }) => {
    const openLink = useOpenLink();
    const user = useMentionUser(storedUsername, reference);
    const username = user?.username || storedUsername;

    if (!username) return null;

    return (
        <Text
            className="text-primary-foreground"
            accessibilityRole="link"
            onPress={() => openLink(`/u/${username}`)}
        >
            {user?.avatar ? (
                <>
                    <View
                        style={{
                            width: AVATAR_SIZE,
                            height: AVATAR_SIZE,
                            marginRight: 4,
                        }}
                    >
                        <Image
                            source={user.avatar}
                            style={{
                                width: AVATAR_SIZE,
                                height: AVATAR_SIZE,
                                borderRadius: AVATAR_SIZE / 2,
                            }}
                            contentFit="cover"
                        />
                    </View>{' '}
                </>
            ) : null}
            @{username}
        </Text>
    );
};

export default Mention;
