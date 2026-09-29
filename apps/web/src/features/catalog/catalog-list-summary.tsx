import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import CatalogSummary from './catalog-summary';
import { useCatalogSearchQuery } from './use-catalog-search-query';

type Props = {
    contentType: MainContentTypeEnum;
    pageSize?: number;
};

const CatalogListSummary: FC<Props> = ({ contentType, pageSize }) => {
    const { pagination, isLoading } = useCatalogSearchQuery(
        contentType,
        pageSize,
    );

    return <CatalogSummary total={pagination?.total} isLoading={isLoading} />;
};

export default CatalogListSummary;
