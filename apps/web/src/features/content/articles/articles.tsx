import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import type { MainContentTypeEnum } from '@hikka/api';

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

import { ARTICLES_PREVIEW_SIZE, contentArticlesOptions } from '../queries';
import ContentArticlesModal from './content-articles-modal';

type Props = {
    content_type: MainContentTypeEnum;
};

const ContentArticles: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { ref, visible } = useVisibleOnce();
    const { list, isPending } = useInfiniteList(
        contentArticlesOptions(content_type, String(params.slug), {
            preview: true,
        }),
        { enabled: visible },
    );

    if (!list ? !isPending : list.length === 0) return null;

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
                            {list
                                ? list.map((article) => (
                                      <ArticlePreviewCard
                                          key={article.slug}
                                          article={article}
                                      />
                                  ))
                                : range(0, ARTICLES_PREVIEW_SIZE).map(
                                      (index) => (
                                          <ArticlePreviewCardSkeleton
                                              key={index}
                                          />
                                      ),
                                  )}
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
