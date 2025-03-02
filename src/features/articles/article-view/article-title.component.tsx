'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import useArticle from '@/services/hooks/articles/use-article';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {}

const ArticleTitle: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    return (
        <div className="flex flex-col gap-1">
            {article?.content && (
                <Link
                    href={`${CONTENT_TYPE_LINKS[article.content.data_type]}/${article.content.slug}`}
                    className="w-fit text-sm text-muted-foreground hover:underline"
                >
                    {article.content.title}
                </Link>
            )}
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">{article!.title}</HeaderTitle>
                </HeaderContainer>
            </Header>
        </div>
    );
};

export default ArticleTitle;
