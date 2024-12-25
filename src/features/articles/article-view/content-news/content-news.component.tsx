'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import useArticles from '@/services/hooks/articles/use-articles';
import { useModalContext } from '@/services/providers/modal-provider';

import ContentNewsItem from './content-news-item';
import ContentNewsModal from './content-news-modal';

interface Props {
    content_type: API.ContentType;
}

const ContentNews: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const { list } = useArticles({
        category: 'news',
        content_type: content_type,
        content_slug: String(params.slug),
    });

    const handleOpenContentNewsModal = () => {
        openModal({
            type: 'sheet',
            title: 'Новини',
            side: 'right',
            content: <ContentNewsModal content_type={content_type} />,
        });
    };

    if (!list || list.length === 0) return null;

    const filteredNews = list?.slice(0, 3);

    return (
        <Block>
            <Header onClick={handleOpenContentNewsModal}>
                <HeaderContainer>
                    <HeaderTitle>Новини</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <div className="flex flex-col gap-6">
                {filteredNews.map((article) => (
                    <ContentNewsItem key={article.slug} article={article} />
                ))}
            </div>
        </Block>
    );
};

export default ContentNews;
