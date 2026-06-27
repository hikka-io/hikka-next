import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getArticleOptions } from '@hikka/api';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { useTitle } from '@/features/auth/hooks/use-title';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link, useParams } from '@/utils/navigation';

type Props = {};

const ArticleTitle: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useQuery(
        getArticleOptions({ path: { slug: String(params.slug) } }),
    );

    const contentTitle = useTitle(article?.content);

    return (
        <div className="flex flex-col gap-1">
            {article?.content && (
                <Link
                    to={`${CONTENT_TYPE_LINKS[article.content.data_type as keyof typeof CONTENT_TYPE_LINKS]}/${article.content.slug}`}
                    className="w-fit text-muted-foreground text-sm hover:underline"
                >
                    {contentTitle}
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
