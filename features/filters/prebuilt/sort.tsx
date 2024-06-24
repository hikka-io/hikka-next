'use client';

import { useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { cn } from '@/utils/utils';

import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

const SORT_CONTENT = [
    {
        label: 'Загальна оцінка',
        value: 'score',
    },
    {
        label: 'Дата релізу',
        value: 'start_date',
    },
    {
        label: 'Тип',
        value: 'media_type',
    },
];

const SORT_WATCHLIST = [
    ...SORT_CONTENT,
    {
        label: 'К-сть епізодів',
        value: 'watch_episodes',
    },
    {
        label: 'Дата додавання',
        value: 'watch_created',
    },
    {
        label: 'Власна оцінка',
        value: 'watch_score',
    },
];

const SORT_READLIST = [
    ...SORT_CONTENT,
    {
        label: 'Дата додавання',
        value: 'read_created',
    },
    {
        label: 'К-сть томів',
        value: 'read_volumes',
    },
    {
        label: 'К-сть розділів',
        value: 'read_chapters',
    },
    {
        label: 'Власна оцінка',
        value: 'read_score',
    },
];

const SORT_EDITLIST = [
    {
        label: 'Номер правки',
        value: 'edit_id',
    },
    {
        label: 'Дата створення',
        value: 'created',
    },
];

interface Props {
    className?: string;
    sort_type: 'anime' | 'watch' | 'manga' | 'novel' | 'read' | 'edit';
}

const Sort: FC<Props> = ({ sort_type }) => {
    const searchParams = useSearchParams()!;

    const order = searchParams.get('order');
    const sort = searchParams.get('sort');

    const handleChangeParam = useChangeParam();

    const getSort = useCallback(() => {
        switch (sort_type) {
            case 'anime':
                return SORT_CONTENT;
            case 'watch':
                return SORT_WATCHLIST;
            case 'manga':
                return SORT_CONTENT;
            case 'novel':
                return SORT_CONTENT;
            case 'read':
                return SORT_READLIST;
            case 'edit':
                return SORT_EDITLIST;
            default:
                return SORT_CONTENT;
        }
    }, [sort_type]);

    return (
        <CollapsibleFilter title="Сортування">
            <div className="flex gap-2">
                <Select
                    value={sort ? [sort] : undefined}
                    onValueChange={(value) =>
                        handleChangeParam('sort', value[0])
                    }
                >
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Виберіть сортування..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {getSort().map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                        handleChangeParam(
                            'order',
                            order === 'asc' ? 'desc' : 'asc',
                        )
                    }
                >
                    <MaterialSymbolsSortRounded
                        className={cn(order === 'asc' && '-scale-y-100')}
                    />
                </Button>
            </div>
        </CollapsibleFilter>
    );
};

export default Sort;
