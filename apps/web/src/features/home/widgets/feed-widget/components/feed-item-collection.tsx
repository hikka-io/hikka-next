import type { FC } from 'react';

import type { CollectionResponse } from '@hikka/api';

import { contentEntity } from '@/components/content-card';
import EntityCard from '@/components/content-card/entity-card';
import PosterCard from '@/components/content-card/poster-card';
import { Badge } from '@/components/ui/badge';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import Image from '@/components/ui/image';
import Stack, { type StackSize } from '@/components/ui/stack';

type Props = {
    data: CollectionResponse;
};

const MAX_PREVIEW = 3;

const FeedItemCollection: FC<Props> = ({ data }) => {
    const previewItems = data.collection.slice(0, MAX_PREVIEW);
    const remainingCount = data.entries - MAX_PREVIEW;
    const previewItem =
        data.collection.length > MAX_PREVIEW
            ? data.collection[MAX_PREVIEW]
            : data.collection[data.collection.length - 1];

    return (
        <div className="flex flex-col gap-4">
            <Header href={`/collections/${data.reference}`}>
                <HeaderContainer>
                    <HeaderTitle variant="h4">{data.title}</HeaderTitle>
                </HeaderContainer>
            </Header>

            {(data.tags.length > 0 || data.spoiler || data.nsfw) && (
                <div className="flex gap-2">
                    {data.spoiler && <Badge variant="warning">Спойлери</Badge>}
                    {data.nsfw && <Badge variant="destructive">+18</Badge>}
                    {data.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                    {data.tags.length > 2 && (
                        <Badge variant="outline">+{data.tags.length - 2}</Badge>
                    )}
                </div>
            )}

            <Stack
                gap="sm"
                size={(MAX_PREVIEW + 1) as StackSize}
                className="grid-min-5"
                imagePreset="cardSm"
            >
                {previewItems.map((item) => (
                    <EntityCard
                        key={item.content.slug}
                        entity={contentEntity(item.content)}
                        title={null}
                        titleBlur={data.spoiler}
                        imageBlur={data.nsfw || data.spoiler}
                    />
                ))}
                {remainingCount > 0 && previewItem && (
                    <PosterCard
                        href={`/collections/${data.reference}`}
                        image={
                            <div className="isolate flex items-center justify-center">
                                {previewItem.content.image && (
                                    <Image
                                        className="absolute -z-10 size-full blur-lg"
                                        src={previewItem.content.image ?? ''}
                                        alt="Third element"
                                    />
                                )}
                                <span className="font-bold text-2xl text-white drop-shadow-lg">
                                    +{remainingCount}
                                </span>
                            </div>
                        }
                    />
                )}
            </Stack>
        </div>
    );
};

export default FeedItemCollection;
