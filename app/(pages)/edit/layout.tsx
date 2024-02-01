import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';

import InternalNavBar from '@/app/_components/internal-navbar';
import NavMenu from '@/app/_components/nav-menu';
import SubBar from '@/app/_components/sub-navbar';
import Breadcrumbs from '@/app/_components/breadcrumbs';
import { EDIT_NAV_ROUTES } from '@/app/_utils/constants';

interface Props extends PropsWithChildren {}

// export const runtime = 'edge';

export async function generateMetadata(
    { params }: { params: { slug: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;

    return {
        title: {
            default: 'Правки',
            template: 'Правки / %s / Hikka',
        },
        description: parentMetadata.description,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: {
                default: 'Правки',
                template: 'Правки / %s / Hikka',
            },
            description: parentMetadata.description || '',
            images: parentMetadata.openGraph?.images,
        },
        twitter: {
            title: {
                default: 'Правки',
                template: 'Правки / %s / Hikka',
            },
            description: parentMetadata.description || '',
            images: parentMetadata.openGraph?.images,
        },
    };
}

const Component = async ({ children }: Props) => {
    return (
        <>
            <Breadcrumbs>
                <NavMenu routes={EDIT_NAV_ROUTES} urlPrefix="/edit" />
            </Breadcrumbs>
            <SubBar mobileOnly>
                <InternalNavBar
                    routes={EDIT_NAV_ROUTES}
                    urlPrefix="/edit"
                />
            </SubBar>
            {children}
        </>
    );
};

export default Component;