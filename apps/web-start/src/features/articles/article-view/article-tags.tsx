'use client';

import { useArticleBySlug } from '@hikka/react';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';

import { useParams } from '@/utils/navigation';

interface Props {}

const ArticleTags: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticleBySlug({
        slug: String(params.slug),
    });

    if (!article?.tags || article.tags.length === 0) return null;

    return (
        <div className="flex gap-2">
            {article?.tags.map((tag) => (
                <Badge key={tag.name} variant="secondary">
                    {tag.name}
                </Badge>
            ))}
        </div>
    );
};

export default ArticleTags;
