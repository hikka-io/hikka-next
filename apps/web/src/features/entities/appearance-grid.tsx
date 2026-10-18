import type { ForwardedRef, ReactNode } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import Stack from '@/components/ui/stack';

type Props<T> = {
    title: string;
    emptyTitle: string;
    emptyIcon: ReactNode;
    /** Link target for the section header in collapsed mode. */
    href?: string;
    extended?: boolean;
    list: T[] | undefined;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    ref?: ForwardedRef<HTMLButtonElement>;
    renderItem: (item: T) => ReactNode;
    /** Override the Stack grid (only people→characters needs this). */
    stackClassName?: string;
};

/** Shared "appearances" section for character and person pages. */
function AppearanceGrid<T>({
    title,
    emptyTitle,
    emptyIcon,
    href,
    extended,
    list,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ref,
    renderItem,
    stackClassName,
}: Props<T>) {
    if (!list || list.length === 0) {
        return extended && list ? (
            <EmptyState
                bordered
                icon={emptyIcon}
                title={emptyTitle}
                description="Інформацію ще не додано"
            />
        ) : null;
    }

    return (
        <Block>
            <Header>
                <HeaderTitle to={!extended ? href : undefined}>
                    {title}
                </HeaderTitle>
            </Header>
            <Stack
                size={4}
                extendedSize={5}
                extended={extended}
                className={stackClassName}
            >
                {(extended ? list : list.slice(0, 4)).map(renderItem)}
            </Stack>
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </Block>
    );
}

export default AppearanceGrid;
