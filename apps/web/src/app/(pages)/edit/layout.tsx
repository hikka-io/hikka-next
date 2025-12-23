import { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import { generateMetadata as _generateMetadata } from '@/utils/metadata';

interface Props extends PropsWithChildren {}

export const metadata: Metadata = _generateMetadata({
    title: {
        default: 'Правки',
        template: 'Правки / %s / Hikka',
    },
});

const EditListLayout: FC<Props> = ({ children }) => {
    return children;
};

export default EditListLayout;
