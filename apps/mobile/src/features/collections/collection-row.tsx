import type { FC } from 'react';

import { ArrowBigUp, Layers, MessageCircle } from 'lucide-react-native';
import { View } from 'react-native';

import type { CollectionResponse } from '@hikka/api';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

type Props = {
    collection: CollectionResponse;
    /** On a profile the author is known, so the author line is left out. */
    compact?: boolean;
};

/** One collection as a list row: cover with the entry count, author, title, stats and warning badges. */
const CollectionRow: FC<Props> = ({ collection, compact }) => {
    return (
        <HorizontalCard
            className="px-4 py-3"
            href={`/collections/${collection.reference}`}
        >
            <HorizontalCardImage
                className="w-14"
                image={collection.collection[0]?.content.image ?? undefined}
                imageBlur={collection.nsfw || collection.spoiler}
            >
                <View className="absolute bottom-1 left-1 flex-row items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5">
                    <Icon as={Layers} className="size-3 text-white" />
                    <Text
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="font-medium text-white text-xs"
                    >
                        {collection.entries}
                    </Text>
                </View>
            </HorizontalCardImage>
            <HorizontalCardContainer className="gap-1">
                {compact ? null : (
                    <View className="flex-row items-center gap-2">
                        <Avatar className="size-5 rounded-sm">
                            <AvatarImage
                                src={collection.author.avatar}
                                size={20}
                            />
                            <AvatarFallback className="rounded-sm" />
                        </Avatar>
                        <Text
                            numberOfLines={1}
                            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                            className="shrink text-muted-foreground text-xs"
                        >
                            {collection.author.username}
                        </Text>
                    </View>
                )}
                <HorizontalCardTitle>{collection.title}</HorizontalCardTitle>
                <View className="flex-row flex-wrap items-center gap-2">
                    <StatItemGroup size="sm" className="flex-1">
                        <StatItem size="sm">
                            <Icon as={MessageCircle} />
                            {collection.comments_count}
                        </StatItem>
                        <StatItem size="sm">
                            <Icon as={ArrowBigUp} className="size-4" />
                            {collection.vote_score}
                        </StatItem>
                    </StatItemGroup>
                    {collection.spoiler && (
                        <Badge variant="warning">Спойлери</Badge>
                    )}
                    {collection.nsfw && (
                        <Badge variant="destructive">+18</Badge>
                    )}
                </View>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default CollectionRow;
