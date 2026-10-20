import { type FC, Fragment } from 'react';

import { View } from 'react-native';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

const AVATAR_SIZE = 40;

type Props = {
    username: string | null;
    avatar?: string | null;
    // Facts after the name (category, relative time), separated by dots like the web's author cards.
    meta: (string | null | undefined)[];
    className?: string;
};

/** The web's author card (`ArticleAuthorCard`, `CollectionViewAuthor`): avatar, username and meta, linking to the profile. */
const AuthorRow: FC<Props> = ({ username, avatar, meta, className }) => {
    const facts = meta.filter((fact): fact is string => !!fact);

    return (
        <HorizontalCard
            href={username ? `/u/${username}` : undefined}
            className={className}
        >
            <Avatar className="size-10 rounded-lg">
                <AvatarImage src={avatar} size={AVATAR_SIZE} />
                <AvatarFallback className="rounded-lg">
                    {username?.[0]}
                </AvatarFallback>
            </Avatar>
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle>{username}</HorizontalCardTitle>
                {facts.length > 0 && (
                    <HorizontalCardDescription>
                        {facts.map((fact, index) => (
                            <Fragment key={fact}>
                                {index > 0 && (
                                    <View className="size-1 rounded-full bg-muted-foreground" />
                                )}
                                <Text
                                    numberOfLines={1}
                                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                                    className="shrink"
                                >
                                    {fact}
                                </Text>
                            </Fragment>
                        ))}
                    </HorizontalCardDescription>
                )}
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default AuthorRow;
