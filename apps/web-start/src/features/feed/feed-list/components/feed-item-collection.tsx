import { CollectionContent, CollectionResponse } from '@hikka/client';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import { Badge } from '@/components/ui/badge';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import Image from '@/components/ui/image';
import Stack, { StackSize } from '@/components/ui/stack';

import { cn } from '@/utils/cn';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    data: CollectionResponse<CollectionContent>;
}

const MAX_PREVIEW = 3;

const FeedItemCollection: FC<Props> = ({ data }) => {
    const previewItems = data.collection.slice(0, MAX_PREVIEW);
    const remainingCount = data.entries - MAX_PREVIEW;
    const previewItem =
        data.collection.length > MAX_PREVIEW
            ? data.collection[MAX_PREVIEW]
            : data.collection[data.collection.length - 1];

    return (
        <div className="flex flex-col gap-4 p-4 py-0">
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
                    <ContentCard
                        key={item.content.slug}
                        image={item.content.image}
                        href={`${CONTENT_TYPE_LINKS[item.content_type]}/${item.content.slug}`}
                        className={cn(data.spoiler && 'spoiler-blur-md')}
                        titleClassName={cn(data.spoiler && 'spoiler-blur-sm')}
                        containerClassName={cn(data.nsfw && 'spoiler-blur-md')}
                        watch={
                            'watch' in item.content &&
                            item.content.watch.length > 0
                                ? item.content.watch[0]
                                : undefined
                        }
                        read={
                            'read' in item.content &&
                            item.content.read.length > 0
                                ? item.content.read[0]
                                : undefined
                        }
                        slug={item.content.slug}
                        content_type={item.content_type}
                    />
                ))}
                {remainingCount > 0 && previewItem && (
                    <ContentCard
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
                                <span className="text-2xl font-bold drop-shadow-lg text-white">
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
