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
import Cover from '@/features/characters/character-view/cover.component';
import Title from '@/features/characters/character-view/title.component';
import { prefetchCharacterInfo } from '@/services/hooks/characters/use-character-info';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants/navigation';
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

const CharacterLayout: FC<Props> = async (props) => {
    const params = await props.params;

    const { slug } = params;

    const { children } = props;

    const queryClient = await getQueryClient();

    await prefetchCharacterInfo({ slug });

    const character: API.Character | undefined = queryClient.getQueryData([
        'character',
        slug,
    ]);

    if (!character) {
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
                            href={'/characters/' + character?.slug}
                            className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                        >
                            {character?.name_ua ||
                                character?.name_en ||
                                character?.name_ja}
                        </Link>
                    </div>
                    <NavMenu
                        routes={CHARACTER_NAV_ROUTES}
                        urlPrefix={`/characters/${slug}`}
                    />
                </Breadcrumbs>
                <SubBar>
                    <InternalNavBar
                        routes={CHARACTER_NAV_ROUTES}
                        urlPrefix={`/characters/${slug}`}
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

export default CharacterLayout;
