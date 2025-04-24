import { CommentsContentType, EditContentType } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    prefetchCommentThread,
    prefetchContentComments,
} from '@hikka/react';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import ContentHeader from '@/features/comments/comment-content-header.component';
import Comments from '@/features/comments/comment-list.component';
import { prefetchContent } from '@/features/comments/prefetch-content';

import { convertTitle } from '@/utils/adapters/convert-title';
import _generateMetadata from '@/utils/generate-metadata';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

export interface MetadataProps {
    params: {
        slug: string;
        content_type: CommentsContentType | EditContentType;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const { content_type, slug } = await params;

    const content = await prefetchContent({
        content_type,
        slug,
    });

    const coverted = convertTitle({
        data: content as any,
        titleLanguage: 'title_ua',
    });

    return _generateMetadata({
        title: `Коментарі / ${coverted.title}`,
    });
}

interface Props {
    params: {
        content_type: CommentsContentType;
        slug: string;
        comment_reference: string[];
    };
}

const CommentsPage: FC<Props> = async (props) => {
    const params = await props.params;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const comment_reference =
        params.comment_reference && params.comment_reference[0];

    const content = await prefetchContent(params);

    if (!content) {
        return permanentRedirect('/');
    }

    !comment_reference &&
        (await prefetchContentComments({
            slug: params.slug,
            contentType: params.content_type,
            clientConfig,
        }));

    comment_reference &&
        (await prefetchCommentThread({
            commentReference: comment_reference,
            clientConfig,
        }));

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="container flex max-w-3xl flex-col gap-12 p-0">
                <div className="flex flex-col gap-16">
                    <ContentHeader
                        slug={params.slug}
                        content_type={params.content_type}
                    />
                    <Comments
                        comment_reference={comment_reference}
                        slug={params.slug}
                        content_type={params.content_type}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default CommentsPage;
