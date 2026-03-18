'use client';

import { ArticleContentType } from '@hikka/client';
import { useSearchArticles } from '@hikka/react';
import { useParams } from '@/utils/navigation';
import { FC, useState } from 'react';

import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';

import Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ContentNewsItem from './components/content-articles-item';
import ContentNewsModal from './components/content-articles-modal';

interface Props {
    content_type: ArticleContentType;
}

const ContentArticles: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { list } = useSearchArticles({
        args: {
            content_type: content_type,
            content_slug: String(params.slug),
        },
    });

    if (!list || list.length === 0) return null;

    const filteredNews = list?.slice(0, 3);

    return (
        <>
            <Card className='bg-secondary/20'>
                <Block>
                    <Header onClick={() => setOpen(true)}>
                        <HeaderContainer>
                            <HeaderTitle variant="h4">Статті</HeaderTitle>
                        </HeaderContainer>
                        <HeaderNavButton />
                    </Header>
                    <div className="flex flex-col gap-6">
                        {filteredNews.map((article) => (
                            <ContentNewsItem key={article.slug} article={article} />
                        ))}
                    </div>
                </Block>
            </Card>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right">
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>Статті</ResponsiveModalTitle>
                    </ResponsiveModalHeader>
                    <Separator />
                    <ContentNewsModal content_type={content_type} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default ContentArticles;
