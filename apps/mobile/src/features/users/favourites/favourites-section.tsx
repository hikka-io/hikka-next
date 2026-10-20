import { type FC, useState } from 'react';

import { useIsFocused } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { View } from 'react-native';

import type { FavouriteContentTypeEnum } from '@hikka/api';

import PosterRow from '@/components/content-card/poster-row';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import { userFavouritesOptions } from '../queries';
import { userFavouritesHref } from '../user-hrefs';
import FavouriteCard, {
    type FavouriteItem,
    favouriteKey,
} from './favourite-card';
import FavouriteChips from './favourite-chips';
import { favouriteEmptyCopy, favouriteHasSubtitles } from './favourite-empty';
import { useFavouriteCategories } from './use-favourite-categories';

type StripProps = {
    username: string;
    type: FavouriteContentTypeEnum;
    count: number;
};

const FavouriteStrip: FC<StripProps> = ({ username, type, count }) => {
    const query = useInfiniteList<FavouriteItem>({
        ...userFavouritesOptions(username, type),
        subscribed: useIsFocused(),
    });

    if (count === 0) {
        const copy = favouriteEmptyCopy(type);

        return (
            <EmptyState
                size="sm"
                bordered
                icon={<Icon as={Heart} />}
                title={copy.title}
                description={copy.description}
            />
        );
    }

    return (
        <PosterRow
            {...query}
            keyExtractor={favouriteKey}
            renderItem={(item) => <FavouriteCard type={type} item={item} />}
            skeleton={{ subtitles: favouriteHasSubtitles(type) }}
        />
    );
};

type Props = {
    username: string;
};

const FavouritesSection: FC<Props> = ({ username }) => {
    const { categories, count, total, isPending, error, refetch } =
        useFavouriteCategories(username);
    const [selected, setSelected] = useState<FavouriteContentTypeEnum | null>(
        null,
    );
    const active =
        selected && categories.includes(selected) ? selected : categories[0];

    if (!isPending && !error && !active) return null;

    return (
        <View className="mt-6 gap-3 px-4">
            <Header>
                <HeaderTitle
                    href={
                        active
                            ? userFavouritesHref(username, active)
                            : undefined
                    }
                    count={total}
                    countPending={isPending}
                >
                    Улюблені
                </HeaderTitle>
            </Header>
            {active ? (
                <>
                    <FavouriteChips
                        categories={categories}
                        count={count}
                        value={active}
                        onValueChange={setSelected}
                    />
                    <FavouriteStrip
                        key={active}
                        username={username}
                        type={active}
                        count={count(active)}
                    />
                </>
            ) : error ? (
                <ErrorState variant="inline" onRetry={() => void refetch()} />
            ) : (
                <View className="flex-row gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </View>
            )}
        </View>
    );
};

export default FavouritesSection;
