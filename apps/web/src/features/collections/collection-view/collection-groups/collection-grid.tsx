import { type FC, memo } from 'react';

import type { CollectionContentResponse } from '@hikka/api';
import { DEFAULT_CONTAINER_RATIO, getTitle } from '@hikka/core';

import { contentEntity } from '@/components/content-card';
import EntityCard from '@/components/content-card/entity-card';
import { Header, HeaderTitle } from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import { useSessionUI } from '@/services/session';

import CollectionCommentPill from '../../collection-comment-pill';

const ASPECT_RATIO = String(DEFAULT_CONTAINER_RATIO);

type Props = {
    group?: string;
    items: CollectionContentResponse[];
};

const CollectionDisplayGrid: FC<Props> = ({ group, items }) => {
    const { preferences } = useSessionUI();

    return (
        <div className="flex scroll-mt-20 flex-col gap-4" id={group}>
            {group && (
                <Header>
                    <HeaderTitle as="h3" size="subsection">
                        {group}
                    </HeaderTitle>
                </Header>
            )}
            <Stack size={5} extendedSize={5} extended>
                {items.map((item) => (
                    <div key={item.content.slug} className="relative">
                        <EntityCard
                            entity={contentEntity(item.content)}
                            title={getTitle(
                                item.content,
                                preferences.title_language,
                                preferences.name_language,
                            )}
                        />
                        {item.comment && (
                            <div
                                className="pointer-events-none absolute top-0 left-0 w-full"
                                style={{ aspectRatio: ASPECT_RATIO }}
                            >
                                <CollectionCommentPill
                                    comment={item.comment}
                                    className="pointer-events-auto absolute right-2 bottom-2 z-1"
                                />
                                <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-12 w-full rounded-b-md bg-linear-to-t from-background/60 to-transparent" />
                            </div>
                        )}
                    </div>
                ))}
            </Stack>
        </div>
    );
};

export default memo(CollectionDisplayGrid);
