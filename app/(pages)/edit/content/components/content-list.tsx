'use client';

import clsx from 'clsx';
import * as React from 'react';
import { FC, useState } from 'react';

import { range } from '@antfu/utils';

import ContentCard from '@/components/content-card/content-card';
import LoadMoreButton from '@/components/load-more-button';
import SkeletonCard from '@/components/skeletons/content-card';
import H3 from '@/components/typography/h3';
import Block from '@/components/ui/block';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import useTodoAnime from '@/services/hooks/edit/todo/useTodoAnime';

interface Props {
    extended?: boolean;
}

const ContentList: FC<Props> = ({ extended }) => {
    const [param, setParam] = useState('title_ua');

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
                <Combobox
                    options={[
                        { value: 'title_ua', label: 'Аніме без назв' },
                        {
                            value: 'synopsis_ua',
                            label: 'Аніме без опису',
                        },
                    ]}
                    value={param}
                    toggleProps={{ variant: 'ghost' }}
                    onChange={(value) => setParam(value)}
                    renderValue={(option) =>
                        !Array.isArray(option) &&
                        option && (
                            <div className="flex items-center gap-2">
                                <H3>{option.label}</H3>
                                {data && (
                                    <Label className="text-muted-foreground">
                                        ({data?.pages[0].pagination.total})
                                    </Label>
                                )}
                            </div>
                        )
                    }
                />
            </div>
            <div
                className={clsx(
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
                        poster={anime.poster}
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
