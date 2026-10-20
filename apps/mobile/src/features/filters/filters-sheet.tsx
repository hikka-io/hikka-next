import type { FC } from 'react';

import {
    useCatalogSearch,
    useUpdateCatalogSearch,
} from './catalog-search-store';
import type { CatalogType } from './filter-params';
import FiltersPanel from './filters-panel';

type Props = {
    type: CatalogType;
    onDone: () => void;
};

/** The catalog's filter sheet: the panel over the catalog's in-memory search. */
const FiltersSheet: FC<Props> = ({ type, onDone }) => (
    <FiltersPanel
        type={type}
        search={useCatalogSearch(type)}
        onUpdate={useUpdateCatalogSearch(type)}
        onDone={onDone}
    />
);

export default FiltersSheet;
