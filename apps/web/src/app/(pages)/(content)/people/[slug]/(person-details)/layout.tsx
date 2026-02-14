import { ContentTypeEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchPersonBySlug } from '@hikka/react/server';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import ContentHeader from '@/components/content-header';

import { getHikkaClientConfig } from '@/utils/hikka-client';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

const PersonDetailsLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;
    const { children } = props;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const person = await prefetchPersonBySlug({
        slug,
        clientConfig,
        queryClient,
    });

    if (!person) {
        return permanentRedirect('/');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="container flex max-w-3xl flex-col gap-12 p-0">
                <div className="flex flex-col gap-12">
                    <ContentHeader
                        disableBreadcrumbs
                        slug={params.slug}
                        content_type={ContentTypeEnum.PERSON}
                    />
                    {children}
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default PersonDetailsLayout;
