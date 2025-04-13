import { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import InternalNavBar from '../../../components/navigation/nav-tabs';
import SubBar from '../../../components/navigation/sub-nav';
import { EDIT_NAV_ROUTES } from '../../../utils/constants/navigation';
import _generateMetadata from '../../../utils/generate-metadata';

interface Props extends PropsWithChildren {}

export const metadata: Metadata = _generateMetadata({
    title: {
        default: 'Правки',
        template: 'Правки / %s / Hikka',
    },
});

const EditListLayout: FC<Props> = ({ children }) => {
    return (
        <>
            <SubBar>
                <InternalNavBar routes={EDIT_NAV_ROUTES} urlPrefix="/edit" />
            </SubBar>
            {children}
        </>
    );
};

export default EditListLayout;
