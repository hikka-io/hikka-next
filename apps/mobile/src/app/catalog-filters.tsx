import { useLocalSearchParams, useRouter } from 'expo-router';

import {
    CATALOG_TYPES,
    type CatalogType,
    FiltersSheet,
} from '@/features/filters';

export default function CatalogFiltersScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ type?: string }>();
    const type = CATALOG_TYPES.find((item) => item === params.type);

    return (
        <FiltersSheet
            type={(type ?? CATALOG_TYPES[0]) as CatalogType}
            onDone={() => router.back()}
        />
    );
}
