'use client';

import { FC } from 'react';

import P from '@/components/typography/p';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import useContent from '@/features/comments/useContent';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

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
            <Header href={link}>
                <HeaderContainer>
                    <HeaderTitle variant="h2">{data?.title}</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <P className="text-sm text-muted-foreground">
                {CONTENT_TYPES[content_type].title_ua}
            </P>
        </div>
    );
};

export default CommentContentHeader;
