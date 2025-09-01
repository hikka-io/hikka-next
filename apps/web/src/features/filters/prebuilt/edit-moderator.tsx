'use client';

import { useSearchUsers } from '@hikka/react';
import { useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';

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

import CollapsibleFilter from '../components/collapsible-filter';
import useChangeParam from '../hooks/use-change-param';

interface Props {
    className?: string;
}

const EditModerator: FC<Props> = ({ className }) => {
    const searchParams = useSearchParams()!;
    const [userSearch, setUserSearch] = useState<string>();
    const { data: users, isFetching: isUsersFetching } = useSearchUsers({
        args: {
            query: userSearch || '',
        },
        options: {
            enabled: !!userSearch,
        },
    });

    const moderator = searchParams.get('moderator');

    const handleChangeParam = useChangeParam();

    const handleUserSearch = (keyword: string) => {
        if (keyword.length < 3) {
            setUserSearch(undefined);
            return;
        }

        setUserSearch(keyword);
    };

    return (
        <CollapsibleFilter title="Модератор" active={!!moderator}>
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
    );
};

export default EditModerator;
