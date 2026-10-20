import { useLocalSearchParams, useRouter } from 'expo-router';

import {
    CATALOG_TYPES,
    type CatalogType,
    FiltersSheet,
} from '@/features/filters';
import { UserListFiltersSheet } from '@/features/users';

/** The catalog's filter sheet, or, with `username`, the filters of that user's list. */
export default function CatalogFiltersScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ type?: string; username?: string }>();
    const type = CATALOG_TYPES.find((item) => item === params.type);

    if (params.username) {
        return (
            <UserListFiltersSheet
                username={params.username}
                type={type}
                onDone={() => router.back()}
            />
        );
    }

    return (
        <FiltersSheet
            type={(type ?? CATALOG_TYPES[0]) as CatalogType}
            onDone={() => router.back()}
        />
    );
}
