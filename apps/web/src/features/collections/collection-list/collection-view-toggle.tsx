import type { FC } from 'react';

import ViewToggle from '@/components/view-toggle';

import { COLLECTIONS_VIEW_KEY } from './constants';

const CollectionViewToggle: FC = () => (
    <div className="hidden sm:block">
        <ViewToggle viewKey={COLLECTIONS_VIEW_KEY} views={['list', 'grid']} />
    </div>
);

export default CollectionViewToggle;
