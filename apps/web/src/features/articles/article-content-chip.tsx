import type { ComponentProps, FC } from 'react';

import type { ContentTypeEnum } from '@hikka/api';

import ContentRefChip from '@/components/content-ref-chip';
import { useTitle } from '@/services/session';

import type { ArticleContent } from './types';

type Props = Omit<
    ComponentProps<typeof ContentRefChip>,
    'contentType' | 'slug' | 'title'
> & {
    content: ArticleContent;
};

const ArticleContentChip: FC<Props> = ({ content, ...props }) => (
    <ContentRefChip
        contentType={content.data_type as ContentTypeEnum}
        slug={content.slug}
        title={useTitle(content)}
        {...props}
    />
);

export default ArticleContentChip;
