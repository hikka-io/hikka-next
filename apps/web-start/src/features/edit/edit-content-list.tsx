import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import {
    type AnimeResponseWithWatch,
    type ContentToDoEnum,
    ContentTypeEnum,
    EditContentToDoEnum,
    getContentEditTodoInfiniteOptions,
} from '@hikka/api';

import ContentCard from '@/components/content-card/content-card';
import SkeletonCard from '@/components/content-card/content-card-skeleton';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';
import Stack from '@/components/ui/stack';
import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { getTitle } from '@/utils/title/get-title';

type Props = {
    extended?: boolean;
};

const OPTIONS = [
    { value: 'title_ua', label: 'Аніме без назв' },
    {
        value: 'synopsis_ua',
        label: 'Аніме без опису',
    },
];

const ContentList: FC<Props> = () => {
    const { preferences } = useSessionUI();
    const [param, setParam] = useState('title_ua');
    const option = OPTIONS.find((o) => o.value === param);

    const {
        list,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        ref,
    } = useInfiniteList(
        getContentEditTodoInfiniteOptions({
            path: {
                content_type: EditContentToDoEnum.ANIME,
                todo_type: param as ContentToDoEnum,
            },
            query: {
                size: 21,
            },
        }),
    );

    if (isLoading && !isFetchingNextPage) {
        return (
            <Stack extended size={5} extendedSize={7}>
                {range(1, 21).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </Stack>
        );
    }

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <div className="flex gap-2">
                <Select
                    value={[param]}
                    onValueChange={(value) => setParam(value[0])}
                >
                    <SelectTrigger>
                        <div className="flex items-center gap-2">
                            <h5>{option?.label}</h5>
                            {data && (
                                <Label className="text-muted-foreground">
                                    ({data?.pages[0].pagination.total})
                                </Label>
                            )}
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            </div>
            <Stack extended size={5} extendedSize={7}>
                {(list as AnimeResponseWithWatch[]).map((anime) => (
                    <ContentCard
                        withContextMenu
                        content_type={ContentTypeEnum.ANIME}
                        key={anime.slug}
                        watch={
                            anime.watch.length > 0 ? anime.watch[0] : undefined
                        }
                        slug={anime.slug}
                        href={`/anime/${anime.slug}`}
                        image={anime.image}
                        title={getTitle(
                            anime,
                            preferences.title_language,
                            preferences.name_language,
                        )}
                    />
                ))}
            </Stack>
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </Block>
    );
};

export default ContentList;
