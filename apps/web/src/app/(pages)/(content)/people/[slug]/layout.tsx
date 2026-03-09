import { ContentTypeEnum } from '@hikka/client';
import { dehydrate, getQueryClient } from '@hikka/react/core';
import { prefetchPersonBySlug } from '@hikka/react/server';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import { ContentDetailLayout } from '@/features/content';

import { PERSON_NAV_ROUTES } from '@/utils/constants/navigation';
import { getHikkaClientConfig } from '@/utils/hikka-client';

import _generateMetadata, { MetadataProps } from './layout.metadata';
import prefetchQueries from './layout.queries';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

export async function generateMetadata(
    props: MetadataProps,
): Promise<Metadata> {
    const params = await props.params;

    return await _generateMetadata({ params });
}

const PersonLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;

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

    await prefetchQueries({ params: { slug }, queryClient });

    return (
        <ContentDetailLayout
            slug={slug}
            contentType={ContentTypeEnum.PERSON}
            navRoutes={PERSON_NAV_ROUTES}
            urlPrefix="/people"
            title={person.name_ua || person.name_en || person.name_native || ''}
            dehydratedState={dehydrate(queryClient)}
        >
            {props.children}
        </ContentDetailLayout>
    );
};

export default PersonLayout;
