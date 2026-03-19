'use client';

import { CommentsContentType } from '@hikka/client';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';

import { useContent } from '@/features/comments';
import Breadcrumbs from '@/features/common/nav-breadcrumbs';

import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

interface Props {
    slug: string;
    content_type: CommentsContentType;
    disableBreadcrumbs?: boolean;
}

const ContentHeader: FC<Props> = ({
    slug,
    content_type,
    disableBreadcrumbs,
}) => {
    const { data } = useContent({
        content_type,
        slug,
    });

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    return (
        <Card className="bg-secondary/20 backdrop-blur-xs">
            {!disableBreadcrumbs && (
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Link
                            to={link}
                            className="flex-1 overflow-hidden text-sm font-bold text-ellipsis hover:underline"
                        >
                            {data?.title}
                        </Link>
                    </div>
                </Breadcrumbs>
            )}
            <Header href={link}>
                <HeaderContainer>
                    {data?.image && (
                        <ContentCard
                            containerClassName="rounded-(--base-radius)"
                            className="w-12"
                            to={link}
                            image={data?.image}
                        />
                    )}
                    <div className="flex flex-1 flex-col">
                        <HeaderTitle variant="h4">{data?.title}</HeaderTitle>
                        <p className="text-muted-foreground text-sm">
                            {CONTENT_TYPES[content_type].title_ua}
                        </p>
                    </div>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
        </Card>
    );
};

export default ContentHeader;
