import { Metadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import InternalNavBar from '@/components/navigation/nav-tabs';
import SubBar from '@/components/navigation/sub-nav';
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

const EditListLayout = ({ children }: Props) => {
    return (
        <>
            <Breadcrumbs>
                <NavMenu routes={EDIT_NAV_ROUTES} urlPrefix="/edit" />
            </Breadcrumbs>
            <SubBar>
                <InternalNavBar routes={EDIT_NAV_ROUTES} urlPrefix="/edit" />
            </SubBar>
            {children}
        </>
    );
};

export default EditListLayout;
