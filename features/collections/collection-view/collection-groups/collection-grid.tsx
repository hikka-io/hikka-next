'use client';

import { FC, memo } from 'react';

import ContentCard from '@/components/content-card/content-card';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import {
    Group as CollectionGroup,
    useCollectionContext,
} from '@/services/providers/collection-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';

interface Props {
    group: CollectionGroup;
}

const CollectionGrid: FC<Props> = ({ group }) => {
    const {
        groups,
        setState: setCollectionState,
        content_type,
    } = useCollectionContext();

    const items = groups.find((g) => g.id === group.id)?.items || [];

    const poster = (content: API.MainContent) =>
        'poster' in content ? content.poster : content.image;

    return (
        <div className="flex flex-col gap-4">
            {group.isGroup && (
                <Header
                    title={
                        group.title && group.title.trim().length > 0
                            ? group.title
                            : 'Нова група'
                    }
                    variant="h5"
                />
            )}
            <Stack size={5} extendedSize={5} extended>
                {items.map((item) => (
                    <ContentCard
                        slug={item.content.slug}
                        content_type={content_type}
                        href={`${CONTENT_TYPE_LINKS[content_type]}/${item.content.slug}`}
                        key={item.id}
                        poster={poster(item.content)}
                        title={item.content.title}
                        watch={
                            'watch' in item.content &&
                            item.content.watch.length > 0
                                ? item.content.watch[0]
                                : undefined
                        }
                    />
                ))}
            </Stack>
        </div>
    );
};

export default memo(CollectionGrid);
