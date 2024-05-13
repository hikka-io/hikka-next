'use client';

import { FC } from 'react';



import useContent from '@/app/(pages)/comments/[content_type]/[slug]/[[...comment_reference]]/components/useContent';
import P from '@/components/typography/p';
import Header from '@/components/ui/header';
import { CONTENT_TYPE_LINKS, CONTENT_TYPES } from '@/utils/constants';


interface Props {
    slug: string;
    content_type: API.ContentType;
}

const ContentHeader: FC<Props> = ({ slug, content_type }) => {
    const { data } = useContent({
        content_type,
        slug
    })

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;


    return (
        <div>
            <Header href={link} title={data?.title} variant="h2" />
            <P className="text-sm text-muted-foreground">{CONTENT_TYPES[content_type].title_ua}</P>
        </div>
    )
}

export default ContentHeader;