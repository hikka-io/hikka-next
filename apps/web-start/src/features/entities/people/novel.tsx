import type { ComponentProps, FC } from 'react';

import { personNovelInfiniteOptions } from '@hikka/api';
import { getTitle } from '@hikka/react/utils';

import NovelCard from '@/components/content-card/novel-card';
import AppearanceGrid from '@/features/entities/appearance-grid';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

type Props = {
    extended?: boolean;
};

const Novel: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            personNovelInfiniteOptions({
                path: { slug: String(params.slug) },
            }),
        );

    return (
        <AppearanceGrid
            title="Ранобе"
            href={`/people/${params.slug}/novel`}
            extended={extended}
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
            renderItem={(ch) => (
                <NovelCard
                    key={ch.novel.slug}
                    // TODO(phase2): drop cast
                    novel={
                        ch.novel as unknown as ComponentProps<
                            typeof NovelCard
                        >['novel']
                    }
                    description={
                        ch.roles[0] ? getTitle(ch.roles[0]) : undefined
                    }
                />
            )}
        />
    );
};

export default Novel;
