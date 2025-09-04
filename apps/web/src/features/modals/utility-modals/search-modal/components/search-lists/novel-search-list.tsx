'use client';

import { NovelResponse } from '@hikka/client';
import { ReactNode } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import useNovelSearchList from '../../hooks/useNovelSearchList';
import NovelCard from '../cards/novel-card';
import SearchPlaceholders from '../search-placeholders';

interface Props {
    onDismiss: (novel: NovelResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const NovelSearchList = ({ onDismiss, type, value }: Props) => {
    const { data, isFetching, isRefetching } = useNovelSearchList({ value });

    return (
        <CommandList className="max-h-none">
            <SearchPlaceholders
                data={data}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.list.length > 0 && (
                <CommandGroup>
                    {data.list.map((novel) => (
                        <CommandItem key={novel.slug} value={novel.slug}>
                            <NovelCard
                                onClick={() => onDismiss(novel)}
                                novel={novel}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                </CommandGroup>
            )}
        </CommandList>
    );
};

export default NovelSearchList;
