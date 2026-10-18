import type { FC } from 'react';

import type { CommentContentTypeEnum, ContentTypeEnum } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';
import { contentPath } from '@/utils/content-paths';
import { CONTENT_TYPES } from '@/utils/labels/content-types';

import { useContent } from './use-content';

type Props = {
    slug: string;
    content_type: CommentContentTypeEnum | typeof ContentTypeEnum.USER;
};

const ContentHeader: FC<Props> = ({ slug, content_type }) => {
    const { data } = useContent({
        content_type,
        slug,
    });

    const link = contentPath(content_type, slug);

    return (
        <Block variant="card" className="backdrop-blur">
            <Header className="gap-4">
                {data?.image && (
                    <PosterCard
                        containerClassName="rounded-(--base-radius)"
                        className="w-12"
                        containerRatio={content_type === 'user' ? 1 : undefined}
                        image={data?.image}
                    />
                )}
                <div className="flex min-w-0 flex-1 flex-col items-start">
                    <HeaderTitle as="h1" size="subsection" to={link}>
                        {data?.title}
                    </HeaderTitle>
                    <p className="text-muted-foreground text-sm">
                        {CONTENT_TYPES[content_type].title_ua}
                    </p>
                </div>
            </Header>
        </Block>
    );
};

export default ContentHeader;
