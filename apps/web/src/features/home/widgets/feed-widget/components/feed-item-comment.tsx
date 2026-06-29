import type { FC } from 'react';

import type { CommentResponseFeed, ContentTypeEnum } from '@hikka/api';

import MDViewer from '@/components/markdown/viewer/md-viewer';
import TextExpand from '@/components/text-expand';
import { Link } from '@/utils/navigation';

import FeedItemContentPreview from './feed-item-content-preview';

type Props = {
    data: CommentResponseFeed;
};

// @hikka/api types `CommentResponseFeed.preview` as a loose `{ [key]: unknown }`.
type CommentPreview = {
    slug?: string;
    title?: string;
};

const FeedItemComment: FC<Props> = ({ data }) => {
    const preview = data.preview as CommentPreview;
    const contentType = data.content_type as ContentTypeEnum;

    return (
        <div className="flex flex-col gap-4 p-4 py-0">
            <FeedItemContentPreview
                contentType={contentType}
                slug={preview.slug}
                title={preview.title}
            />
            {data.text && (
                <TextExpand>
                    <Link
                        to={`/comments/${contentType}/${preview.slug}`}
                        className="cursor-pointer"
                    >
                        <MDViewer className="text-[0.9375rem]" preview>
                            {data.text}
                        </MDViewer>
                    </Link>
                </TextExpand>
            )}
        </div>
    );
};

export default FeedItemComment;
