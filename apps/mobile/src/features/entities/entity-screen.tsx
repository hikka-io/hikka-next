import { type FC, Fragment, type ReactElement } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import BlockList from '@/components/block-list';
import ErrorState from '@/components/error-state';
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

const hasSlug = (queryKey: readonly unknown[], slug: string) => {
    const first = queryKey[0] as { path?: { slug?: string } } | undefined;

    return first?.path?.slug === slug;
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
    const queryClient = useQueryClient();
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
                    onRefresh={() =>
                        queryClient.invalidateQueries({
                            predicate: (query) => hasSlug(query.queryKey, slug),
                        })
                    }
                />
            )}
        </>
    );
};

export default EntityScreen;
