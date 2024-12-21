'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';

import useArticle from '@/services/hooks/articles/use-article';

interface Props {}

const ArticleTags: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    if (!article?.tags || article.tags.length === 0) return null;

    return (
        <div className="flex gap-2">
            {article?.tags.map((tag) => (
                <Badge variant="secondary">{tag}</Badge>
            ))}
        </div>
    );
};

export default ArticleTags;
