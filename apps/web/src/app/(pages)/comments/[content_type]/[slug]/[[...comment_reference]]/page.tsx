import { CommentsContentType, EditContentType } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import {
    prefetchCommentThread,
    prefetchContentComments,
} from '@hikka/react/server';
import { addTitleProperty } from '@hikka/react/utils';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import ContentHeader from '@/components/content-header';

import { CommentList as Comments, prefetchContent } from '@/features/comments';

import { getHikkaClientConfig } from '@/utils/hikka-client';
import { generateMetadata as _generateMetadata } from '@/utils/metadata';

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
    const queryClient = getQueryClient();

    const content = await prefetchContent({
        content_type,
        slug,
        queryClient,
    });

    if (!content) {
        return _generateMetadata({
            title: `Коментарі`,
        });
    }

    if ('title' in content) {
        return _generateMetadata({
            title: `Коментарі / ${content.title}`,
        });
    }

    const converted = addTitleProperty(content as any, 'title_ua');

    return _generateMetadata({
        title: `Коментарі / ${converted.title}`,
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

    const content = await prefetchContent({
        ...params,
        queryClient,
    });

    if (!content) {
        return permanentRedirect('/');
    }

    !comment_reference &&
        (await prefetchContentComments({
            slug: params.slug,
            contentType: params.content_type,
            clientConfig,
            queryClient,
        }));

    comment_reference &&
        (await prefetchCommentThread({
            commentReference: comment_reference,
            clientConfig,
            queryClient,
        }));

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="container flex max-w-3xl flex-col gap-12 p-0">
                <div className="flex flex-col gap-12">
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
