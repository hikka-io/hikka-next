import { type FC, Fragment, type ReactElement } from 'react';

import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import BlockList from '@/components/block-list';
import ErrorState from '@/components/ui/error-state';
import { bySlug, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';
import { shareSitePath } from '@/utils/share';

import EntitySkeleton from './entity-skeleton';

type Props = {
    slug: string;
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
    sharePath,
    title,
    isPending,
    error,
    refetch,
    header,
    sections,
}) => {
    const { refreshing, onRefresh } = usePullToRefresh(bySlug(slug));
    const ready = !isPending && !error;

    return (
        <>
            <Stack.Title>{title}</Stack.Title>
            {Platform.OS === 'ios' && ready && (
                <Stack.Toolbar placement="right">
                    <Stack.Toolbar.Button
                        icon="square.and.arrow.up"
                        accessibilityLabel="Поділитися"
                        onPress={() => shareSitePath(sharePath)}
                    />
                </Stack.Toolbar>
            )}
            {isPending ? (
                <EntitySkeleton />
            ) : error ? (
                <ErrorState error={error} onRetry={refetch} />
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
