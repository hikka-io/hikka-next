import { Metadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Breadcrumbs from '@/components/breadcrumbs';
import InternalNavBar from '@/components/internal-navbar';
import NavMenu from '@/components/nav-menu';
import SubBar from '@/components/sub-navbar';
import { EDIT_NAV_ROUTES } from '@/utils/constants';
import _generateMetadata from '@/utils/generateMetadata';

interface Props extends PropsWithChildren {}

// export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: {
            default: 'Правки',
            template: 'Правки / %s / Hikka',
        },
    });
}

const Component = ({ children }: Props) => {
    return (
        <>
            <Breadcrumbs>
                <NavMenu routes={EDIT_NAV_ROUTES} urlPrefix="/edit" />
            </Breadcrumbs>
            <SubBar mobileOnly>
                <InternalNavBar routes={EDIT_NAV_ROUTES} urlPrefix="/edit" />
            </SubBar>
            {children}
        </>
    );
};

export default Component;
