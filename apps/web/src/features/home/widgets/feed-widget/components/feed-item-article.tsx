import { type FC, lazy, Suspense } from 'react';

import type { Value } from 'platejs';

import type { ArticlePreviewResponse, ContentTypeEnum } from '@hikka/api';

import { Badge } from '@/components/ui/badge';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Link } from '@/utils/navigation';

import FeedItemContentPreview from './feed-item-content-preview';

const StaticViewer = lazy(() =>
    import('@/components/plate/editor/static-viewer').then((m) => ({
        default: m.StaticViewer,
    })),
);

type Props = {
    data: ArticlePreviewResponse;
};

// The article `content` union doesn't expose a flat `title`; capture the
// preview fields this card reads.
type ArticleContentPreview = {
    data_type?: ContentTypeEnum;
    slug?: string;
    title?: string;
};

const FeedItemArticle: FC<Props> = ({ data }) => {
    const content = data.content as ArticleContentPreview | null;

    return (
        <div className="relative flex flex-col gap-4 p-4 py-0">
            <FeedItemContentPreview
                contentType={content?.data_type}
                slug={content?.slug}
                title={content?.title}
            />

            <div className="flex flex-col gap-4">
                <Header href={`/articles/${data.slug}`}>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">{data.title}</HeaderTitle>
                    </HeaderContainer>
                </Header>

                {data.tags.length > 0 && (
                    <div className="flex gap-2">
                        {data.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag.name} variant="secondary">
                                {tag.name}
                            </Badge>
                        ))}
                        {data.tags.length > 2 && (
                            <Badge variant="outline">
                                +{data.tags.length - 2}
                            </Badge>
                        )}
                    </div>
                )}
                <div className="relative">
                    <Link
                        to={`/articles/${data.slug}`}
                        className="absolute top-0 left-0 z-10 size-full"
                    />
                    {data.preview && data.preview.length > 0 && (
                        <Suspense
                            fallback={
                                <div className="h-20 animate-pulse rounded bg-muted" />
                            }
                        >
                            <StaticViewer value={data.preview as Value} />
                        </Suspense>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedItemArticle;
