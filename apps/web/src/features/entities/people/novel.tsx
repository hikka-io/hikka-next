import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import NovelCard from '@/components/content-card/novel-card';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

import AppearanceGrid from '../appearance-grid';
import { entityAppearanceOptions } from '../queries';

type Props = {
    extended?: boolean;
};

const PersonNovel: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            entityAppearanceOptions(
                ContentTypeEnum.PERSON,
                'novel',
                String(params.slug),
                { preview: !extended },
            ),
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
                    item={ch.novel}
                    description={
                        ch.roles[0] ? getTitle(ch.roles[0]) : undefined
                    }
                />
            )}
        />
    );
};

export default PersonNovel;
