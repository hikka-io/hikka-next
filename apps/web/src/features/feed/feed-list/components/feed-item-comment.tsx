import Link from 'next/link';
import { FC } from 'react';

import { CommentResponse } from '@hikka/client';

import MDViewer from '@/components/markdown/viewer/MD-viewer';

import FeedItemContentPreview from './feed-item-content-preview';

interface Props {
    data: CommentResponse;
}

const FeedItemComment: FC<Props> = ({ data }) => {
    return (
        <div className="flex flex-col gap-4 p-4 py-0">
            <FeedItemContentPreview
                contentType={data.content_type}
                slug={data.preview.slug}
                title={data.preview.title}
            />
            {data.text && (
                <Link
                    href={`/comments/${data.content_type}/${data.preview.slug}`}
                    className="hover:underline"
                >
                    <MDViewer
                        className="line-clamp-4 break-words text-[0.9375rem]"
                        preview
                    >
                        {data.text}
                    </MDViewer>
                </Link>
            )}
        </div>
    );
};

export default FeedItemComment;
