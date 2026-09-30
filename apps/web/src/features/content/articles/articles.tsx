import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import {
    getArticlesInfiniteOptions,
    type MainContentTypeEnum,
} from '@hikka/api';

import {
    ArticlePreviewCard,
    ArticlePreviewCardSkeleton,
} from '@/components/list-items';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
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
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import ContentRailSkeleton from '../content-rail-skeleton';
import ContentArticlesModal from './content-articles-modal';

const PREVIEW_COUNT = 3;

type Props = {
    content_type: MainContentTypeEnum;
};

const ContentArticles: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { ref, visible } = useVisibleOnce();
    const { list, isPending } = useInfiniteList(
        getArticlesInfiniteOptions({
            body: {
                content_type,
                content_slug: String(params.slug),
            },
        }),
        { enabled: visible },
    );

    if (!list) {
        return isPending ? (
            <div ref={ref}>
                <ContentRailSkeleton className="-mx-2">
                    {range(0, PREVIEW_COUNT).map((index) => (
                        <ArticlePreviewCardSkeleton key={index} />
                    ))}
                </ContentRailSkeleton>
            </div>
        ) : null;
    }

    if (list.length === 0) return null;

    const filteredNews = list.slice(0, PREVIEW_COUNT);

    return (
        <>
            <div ref={ref}>
                <Card id="content-articles">
                    <Block>
                        <Header onClick={() => setOpen(true)}>
                            <HeaderContainer>
                                <HeaderTitle variant="h4">Статті</HeaderTitle>
                            </HeaderContainer>
                            <HeaderNavButton />
                        </Header>
                        <div className="-mx-2 flex flex-col">
                            {filteredNews.map((article) => (
                                <ArticlePreviewCard
                                    key={article.slug}
                                    article={article}
                                />
                            ))}
                        </div>
                    </Block>
                </Card>
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="left" title="Статті">
                    <ContentArticlesModal content_type={content_type} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default ContentArticles;
