import type { FC } from 'react';

import type {
    CommentContentTypeEnum as CommentsContentType,
    ContentTypeEnum,
} from '@hikka/api';

import ContentCard from '@/components/content-card/content-card';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { CONTENT_TYPES } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

import { useContent } from './hooks/use-content';

type Props = {
    slug: string;
    content_type: CommentsContentType | typeof ContentTypeEnum.USER;
};

const ContentHeader: FC<Props> = ({ slug, content_type }) => {
    const { data } = useContent({
        content_type,
        slug,
    });

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    return (
        <Card>
            <Header href={link}>
                <HeaderContainer>
                    {data?.image && (
                        <ContentCard
                            containerClassName="rounded-(--base-radius)"
                            className="w-12"
                            containerRatio={
                                content_type === 'user' ? 1 : undefined
                            }
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
