'use client';

import { ArticleContentType } from '@hikka/client';
import { useArticlesList } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import { useModalContext } from '@/services/providers/modal-provider';

import ContentNewsItem from './content-articles-item';
import ContentNewsModal from './content-articles-modal';

interface Props {
    content_type: ArticleContentType;
}

const ContentArticles: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const { list } = useArticlesList({
        args: {
            content_type: content_type,
            content_slug: String(params.slug),
        },
    });

    const handleOpenContentNewsModal = () => {
        openModal({
            type: 'sheet',
            title: 'Статті',
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
                    <HeaderTitle>Статті</HeaderTitle>
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

export default ContentArticles;
