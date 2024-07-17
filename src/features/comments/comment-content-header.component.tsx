'use client';

import { FC } from 'react';

import P from '@/components/typography/p';
import Header from '@/components/ui/header';

import useContent from '@/features/comments/useContent';

import { CONTENT_TYPES, CONTENT_TYPE_LINKS } from '@/utils/constants';

interface Props {
    slug: string;
    content_type: API.ContentType;
}

const CommentContentHeader: FC<Props> = ({ slug, content_type }) => {
    const { data } = useContent({
        content_type,
        slug,
    });

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    return (
        <div>
            <Header href={link} title={data?.title} variant="h2" />
            <P className="text-sm text-muted-foreground">
                {CONTENT_TYPES[content_type].title_ua}
            </P>
        </div>
    );
};

export default CommentContentHeader;
