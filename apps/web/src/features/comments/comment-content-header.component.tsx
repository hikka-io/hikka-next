'use client';

import { CommentsContentType } from '@hikka/client';
import Link from 'next/link';
import { FC } from 'react';

import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import ContentCard from '../../components/content-card/content-card';
import Breadcrumbs from '../../components/navigation/nav-breadcrumbs';
import P from '../../components/typography/p';
import { useContent } from './use-content';

interface Props {
    slug: string;
    content_type: CommentsContentType;
}

const CommentContentHeader: FC<Props> = ({ slug, content_type }) => {
    const { data } = useContent({
        content_type,
        slug,
    });

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    return (
        <Card>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    <Link
                        href={link}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {data?.title}
                    </Link>
                </div>
            </Breadcrumbs>
            <Header href={link}>
                <HeaderContainer>
                    {data?.image && (
                        <ContentCard
                            className="w-12"
                            href={link}
                            image={data?.image}
                        />
                    )}
                    <div className="flex flex-1 flex-col">
                        <HeaderTitle variant="h4">{data?.title}</HeaderTitle>
                        <P className="text-muted-foreground text-sm">
                            {CONTENT_TYPES[content_type].title_ua}
                        </P>
                    </div>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
        </Card>
    );
};

export default CommentContentHeader;
