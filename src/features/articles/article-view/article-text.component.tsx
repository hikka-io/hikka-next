'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import MDViewer from '@/components/markdown/viewer/MD-viewer';

import useArticle from '@/services/hooks/articles/use-article';

interface Props {}

const ArticleText: FC<Props> = () => {
    const params = useParams();

    const { data: article } = useArticle({
        slug: String(params.slug),
    });

    return <MDViewer>{article!.text}</MDViewer>;
};

export default ArticleText;
