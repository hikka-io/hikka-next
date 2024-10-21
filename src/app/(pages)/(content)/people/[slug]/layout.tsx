import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import InternalNavBar from '@/components/navigation/nav-tabs';
import SubBar from '@/components/navigation/sub-nav';

import Cover from '@/features/people/person-view/cover.component';
import Title from '@/features/people/person-view/title.component';

import { prefetchPersonInfo } from '@/services/hooks/people/use-person-info';
import { PERSON_NAV_ROUTES } from '@/utils/constants/navigation';
import getQueryClient from '@/utils/get-query-client';

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
    const params = await props.params;

    return await _generateMetadata({ params }, parent);
}

const PersonLayout: FC<Props> = async (props) => {
    const params = await props.params;

    const { slug } = params;

    const { children } = props;

    const queryClient = getQueryClient();

    await prefetchPersonInfo({ slug });

    const person: API.Person | undefined = queryClient.getQueryData([
        'person',
        slug,
    ]);

    if (!person) {
        return permanentRedirect('/');
    }

    await prefetchQueries({ params: { slug } });

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
