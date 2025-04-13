'use client';

import { range } from '@antfu/utils';
import { FC, useState } from 'react';

import ContentCard from '../../components/content-card/content-card';
import LoadMoreButton from '../../components/load-more-button';
import SkeletonCard from '../../components/skeletons/content-card-skeleton';
import H5 from '../../components/typography/h5';
import Block from '../../components/ui/block';
import { Label } from '../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectIcon,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '../../components/ui/select';
import useTodoAnime from '../../services/hooks/edit/todo/use-todo-anime';
import { cn } from '../../utils/utils';

interface Props {
    extended?: boolean;
}

const OPTIONS = [
    { value: 'title_ua', label: 'Аніме без назв' },
    {
        value: 'synopsis_ua',
        label: 'Аніме без опису',
    },
];

const ContentList: FC<Props> = ({ extended }) => {
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
    } = useTodoAnime({ param });

    if (isLoading && !isFetchingNextPage) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8">
                {range(1, 20).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </div>
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
                            <H5>{option?.label}</H5>
                            {data && (
                                <Label className="text-muted-foreground">
                                    ({data?.pages[0].pagination.total})
                                </Label>
                            )}
                        </div>
                        <SelectIcon />
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
            <div
                className={cn(
                    'grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8',
                    extended && 'md:grid-cols-5',
                )}
            >
                {list.map((anime) => (
                    <ContentCard
                        withContextMenu
                        content_type="anime"
                        key={anime.slug}
                        watch={
                            anime.watch.length > 0 ? anime.watch[0] : undefined
                        }
                        slug={anime.slug}
                        href={`/anime/${anime.slug}`}
                        image={anime.image}
                        title={anime.title}
                    />
                ))}
            </div>
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
