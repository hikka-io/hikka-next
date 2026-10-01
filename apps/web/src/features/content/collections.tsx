import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import type { CollectionContentTypeEnum } from '@hikka/api';

import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import {
    CollectionItem,
    CollectionItemSkeleton,
} from '@/components/list-items';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { CollectionListModal } from '@/features/collections';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import ContentRailSkeleton from './content-rail-skeleton';
import { COLLECTIONS_PREVIEW_SIZE, contentCollectionsOptions } from './queries';

type Props = {
    content_type: CollectionContentTypeEnum;
};

const ContentCollections: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const slug = String(params.slug);

    const { ref, visible } = useVisibleOnce();
    const { list, isPending } = useInfiniteList(
        contentCollectionsOptions(content_type, slug, { preview: true }),
        { enabled: visible },
    );

    if (!list) {
        return isPending ? (
            <div ref={ref}>
                <ContentRailSkeleton className="gap-6">
                    {range(0, COLLECTIONS_PREVIEW_SIZE).map((index) => (
                        <CollectionItemSkeleton key={index} />
                    ))}
                </ContentRailSkeleton>
            </div>
        ) : null;
    }

    if (list.length === 0) return null;

    return (
        <>
            <div ref={ref}>
                <Card id="content-collections">
                    <Block>
                        <Header onClick={() => setOpen(true)}>
                            <HeaderContainer>
                                <HeaderTitle variant="h4">Колекції</HeaderTitle>
                            </HeaderContainer>
                            <HeaderNavButton />
                        </Header>
                        <div className="flex flex-col gap-6">
                            {list.map((collection) => (
                                <CollectionItem
                                    key={collection.reference}
                                    data={collection}
                                />
                            ))}
                        </div>
                    </Block>
                </Card>
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="left" title="Колекції">
                    <CollectionListModal
                        options={contentCollectionsOptions(content_type, slug)}
                        emptyState={
                            <EmptyState
                                icon={<MaterialSymbolsStack />}
                                title="Колекцій не знайдено"
                                description="Цей тайтл ще не додано до жодної колекції"
                            />
                        }
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default ContentCollections;
