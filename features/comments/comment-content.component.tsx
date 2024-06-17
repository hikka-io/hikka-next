'use client';

import Link from 'next/link';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import Block from '@/components/ui/block';

import { CONTENT_TYPE_LINKS } from '@/utils/constants';

import useContent from './useContent';

interface Props {
    slug: string;
    content_type: API.ContentType;
}

const CommentContent: FC<Props> = ({ slug, content_type }) => {
    const { data } = useContent({ content_type, slug });

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    return (
        <Block>
            <div className="hidden w-full items-center gap-4 px-16 md:px-48 lg:flex lg:px-0">
                <ContentCard href={link} image={data?.image} />
            </div>
            <div className="flex w-full gap-4 lg:hidden">
                <div className="w-12">
                    <ContentCard href={link} image={data?.image} />
                </div>
                <Link href={link}>{data?.title}</Link>
            </div>
        </Block>
    );
};

export default CommentContent;
