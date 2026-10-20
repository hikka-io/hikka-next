import { useLocalSearchParams } from 'expo-router';

import { FavouriteContentTypeEnum } from '@hikka/api';

import { FavouritesPage } from '@/features/users';

const TYPES: readonly string[] = Object.values(FavouriteContentTypeEnum);

const isFavouriteType = (value?: string): value is FavouriteContentTypeEnum =>
    !!value && TYPES.includes(value);

export default function UserFavoritesScreen() {
    const { username, type } = useLocalSearchParams<{
        username: string;
        type?: string;
    }>();

    return (
        <FavouritesPage
            key={username}
            username={username}
            initialType={isFavouriteType(type) ? type : undefined}
        />
    );
}
