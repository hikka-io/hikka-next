'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectEmpty,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSearch,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import useUsers from '@/services/hooks/user/use-users';
import { EDIT_STATUSES } from '@/utils/constants';
import createQueryString from '@/utils/create-query-string';

import CollapsibleFilter from './collapsible-filter';

interface Props {
    className?: string;
}

const SORT = [
    {
        label: 'Номер правки',
        value: 'edit_id',
    },
    {
        label: 'Дата створення',
        value: 'created',
    },
];

const CONTENT_TYPES: Record<string, any> = {
    anime: {
        title_ua: 'Аніме',
        title_en: 'Anime',
    },
    character: {
        title_ua: 'Персонаж',
        title_en: 'Character',
    },
    person: {
        title_ua: 'Людина',
        title_en: 'Person',
    },
};

const EditFilters: FC<Props> = ({ className }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const content_type = searchParams.get('content_type');
    const order = searchParams.get('order');
    const sort = searchParams.get('sort') || 'edit_id';
    const edit_status = searchParams.get('edit_status');
    const author = searchParams.get('author');
    const moderator = searchParams.get('moderator');

    const [userSearch, setUserSearch] = useState<string>();
    const { data: users, isFetching: isUsersFetching } = useUsers({
        query: userSearch,
    });

    const clearFilters = () => {
        router.replace(`${pathname}`);
    };

    const handleChangeParam = (
        name: string,
        value: string | string[] | boolean,
    ) => {
        const query = createQueryString(
            name,
            value,
            createQueryString(
                'page',
                '1',
                createQueryString(
                    'iPage',
                    '1',
                    new URLSearchParams(searchParams),
                ),
            ),
        );
        router.replace(`${pathname}?${query}`);
    };

    const handleUserSearch = (keyword: string) => {
        if (keyword.length < 3) {
            setUserSearch(undefined);
            return;
        }

        setUserSearch(keyword);
    };

    return (
        <ScrollArea className="flex h-full flex-col lg:max-h-[calc(100vh-6rem)]">
            <div className="flex flex-col">
                <CollapsibleFilter defaultOpen title="Сортування">
                    <div className="flex gap-2">
                        <Select
                            value={[sort]}
                            onValueChange={(value) =>
                                handleChangeParam('sort', value[0])
                            }
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Тип сортування..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectList>
                                    <SelectGroup>
                                        {SORT.map((item) => (
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
                                className={clsx(
                                    order === 'asc' && '-scale-y-100',
                                )}
                            />
                        </Button>
                    </div>
                </CollapsibleFilter>
                <CollapsibleFilter defaultOpen title="Статус">
                    <Select
                        value={edit_status ? [edit_status] : undefined}
                        onValueChange={(value) =>
                            handleChangeParam('edit_status', value[0])
                        }
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Виберіть статус..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {(
                                        Object.keys(
                                            EDIT_STATUSES,
                                        ) as API.EditStatus[]
                                    ).map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {EDIT_STATUSES[item].title_ua}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </CollapsibleFilter>
                <CollapsibleFilter title="Тип контенту">
                    <Select
                        value={content_type ? [content_type] : undefined}
                        onValueChange={(value) =>
                            handleChangeParam('content_type', value[0])
                        }
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Виберіть тип контенту..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {Object.keys(CONTENT_TYPES).map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {CONTENT_TYPES[item].title_ua}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </CollapsibleFilter>
                <CollapsibleFilter title="Автор">
                    <Select
                        value={author !== null ? [author] : []}
                        onValueChange={(value) =>
                            handleChangeParam('author', value[0])
                        }
                        onOpenChange={() => setUserSearch(undefined)}
                        onSearch={handleUserSearch}
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Виберіть користувача..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectSearch placeholder="Імʼя користувача..." />
                            <SelectList>
                                <SelectGroup>
                                    {!isUsersFetching &&
                                        users?.map((item) => (
                                            <SelectItem
                                                key={item.username}
                                                value={item.username}
                                            >
                                                {item.username}
                                            </SelectItem>
                                        ))}
                                    <SelectEmpty>
                                        {isUsersFetching
                                            ? 'Завантаження...'
                                            : 'Користувачів не знайдено'}
                                    </SelectEmpty>
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </CollapsibleFilter>
                <CollapsibleFilter title="Модератор">
                    <Select
                        value={moderator !== null ? [moderator] : []}
                        onValueChange={(value) =>
                            handleChangeParam('moderator', value[0])
                        }
                        onOpenChange={() => setUserSearch(undefined)}
                        onSearch={handleUserSearch}
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Виберіть користувача..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectSearch placeholder="Імʼя користувача..." />
                            <SelectList>
                                <SelectGroup>
                                    {!isUsersFetching &&
                                        users?.map((item) => (
                                            <SelectItem
                                                key={item.username}
                                                value={item.username}
                                            >
                                                {item.username}
                                            </SelectItem>
                                        ))}
                                    <SelectEmpty>
                                        {isUsersFetching
                                            ? 'Завантаження...'
                                            : 'Користувачів не знайдено'}
                                    </SelectEmpty>
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </CollapsibleFilter>
            </div>
            <Button
                variant="secondary"
                className="mt-4 w-full shadow-md lg:flex"
                onClick={clearFilters}
                asChild
            >
                <Link href="/edit">
                    <AntDesignClearOutlined /> Очистити
                </Link>
            </Button>
        </ScrollArea>
    );
};

export default EditFilters;
