import { Metadata, ResolvingMetadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import InternalNavBar from '@/components/navigation/nav-tabs';
import SubBar from '@/components/navigation/sub-nav';
import getPersonInfo from '@/services/api/people/getPersonInfo';
import { PERSON_NAV_ROUTES } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

import Cover from './components/cover';
import Title from './components/title';
import _generateMetadata, { MetadataProps } from './layout.metadata';
import prefetchQueries from './layout.queries';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

export async function generateMetadata(
    props: MetadataProps,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    return await _generateMetadata(props, parent);
}

const PersonLayout: FC<Props> = async ({ params: { slug }, children }) => {
    const queryClient = await getQueryClient();

    const person = await queryClient.fetchQuery({
        queryKey: ['person', slug],
        queryFn: ({ meta }) =>
            getPersonInfo({
                params: {
                    slug,
                },
            }),
    });

    if (!person) {
        return redirect('/');
    }

    await prefetchQueries({ queryClient, params: { slug } });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Link
                            href={'/people/' + person?.slug}
                            className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                        >
                            {person?.name_ua ||
                                person?.name_en ||
                                person?.name_native}
                        </Link>
                    </div>
                    <NavMenu
                        routes={PERSON_NAV_ROUTES}
                        urlPrefix={'/people/' + slug}
                    />
                </Breadcrumbs>
                <SubBar>
                    <InternalNavBar
                        routes={PERSON_NAV_ROUTES}
                        urlPrefix={'/people/' + slug}
                    />
                </SubBar>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                    <div className="flex flex-col gap-4">
                        <Cover />
                    </div>
                    <div className="flex flex-col gap-12">
                        <Title />
                        {children}
                    </div>
                </div>
            </>
        </HydrationBoundary>
    );
};

export default PersonLayout;
