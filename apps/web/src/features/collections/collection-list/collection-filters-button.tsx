import type { FC } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '@/components/ui/button';
import { FiltersModal } from '@/features/filters';

import { CollectionFiltersBody } from './collection-filters';
import { COLLECTION_FILTERS_PRESERVE } from './constants';

const CollectionFiltersButton: FC = () => (
    <FiltersModal
        preserve={COLLECTION_FILTERS_PRESERVE}
        body={
            <CollectionFiltersBody className="-m-4 flex-1 overflow-y-auto p-4" />
        }
    >
        <Button variant="outline" size="md">
            <AntDesignFilterFilled /> Фільтри
        </Button>
    </FiltersModal>
);

export default CollectionFiltersButton;
