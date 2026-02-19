import { ArticlePreviewResponse } from '@hikka/client';
import { FC } from 'react';

import { StaticViewer } from '@/components/plate/editor/static-viewer';
import { Badge } from '@/components/ui/badge';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import FeedItemContentPreview from './feed-item-content-preview';

interface Props {
    data: ArticlePreviewResponse;
}

const FeedItemArticle: FC<Props> = ({ data }) => {
    return (
        <div className="relative flex flex-col gap-4 p-4 py-0">
            <FeedItemContentPreview
                contentType={data.content?.data_type}
                slug={data.content?.slug}
                title={data.content?.title}
            />

            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h4">{data.title}</HeaderTitle>
                </HeaderContainer>
            </Header>

            {data.tags.length > 0 && (
                <div className="relative z-20 flex gap-2">
                    {data.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.name} variant="secondary">
                            {tag.name}
                        </Badge>
                    ))}
                    {data.tags.length > 2 && (
                        <Badge variant="outline">+{data.tags.length - 2}</Badge>
                    )}
                </div>
            )}
            {data.preview && data.preview.length > 0 && (
                <StaticViewer value={data.preview} />
            )}
        </div>
    );
};

export default FeedItemArticle;
