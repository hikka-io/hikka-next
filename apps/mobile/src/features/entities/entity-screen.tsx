import { type FC, Fragment, type ReactElement } from 'react';

import type { FavouriteContentTypeEnum } from '@hikka/api';

import BlockList from '@/components/block-list';
import DetailHeaderChrome from '@/components/detail-header-chrome';
import {
    renderFavouriteToolbarButton,
    useFavourite,
} from '@/components/favourite';
import ErrorState from '@/components/ui/error-state';
import { isNotFoundError } from '@/utils/api/is-not-found';
import { byContent, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import EntitySkeleton from './entity-skeleton';

type Props = {
    slug: string;
    favouriteType: FavouriteContentTypeEnum;
    sharePath: string;
    title: string;
    isPending: boolean;
    error: unknown;
    refetch: () => void;
    header: ReactElement | null | undefined;
    sections: ReactElement[];
};

const EntityScreen: FC<Props> = ({
    slug,
    favouriteType,
    sharePath,
    title,
    isPending,
    error,
    refetch,
    header,
    sections,
}) => {
    const { refreshing, onRefresh } = usePullToRefresh(byContent(slug));
    const ready = !isPending && !error;
    const favourite = useFavourite(favouriteType, slug);

    return (
        <>
            <DetailHeaderChrome
                title={title}
                sharePath={ready ? sharePath : undefined}
                actions={
                    ready ? renderFavouriteToolbarButton(favourite) : undefined
                }
            />
            {isPending ? (
                <EntitySkeleton />
            ) : error ? (
                <ErrorState
                    error={error}
                    onRetry={refetch}
                    notFound={isNotFoundError(error)}
                />
            ) : (
                <BlockList
                    blocks={[
                        <Fragment key="header">{header}</Fragment>,
                        ...sections,
                    ]}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            )}
        </>
    );
};

export default EntityScreen;
