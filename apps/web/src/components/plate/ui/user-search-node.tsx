import * as React from 'react';

import { createLinkNode } from '@platejs/link';
import { useQuery } from '@tanstack/react-query';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { searchUsersOptions } from '@hikka/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DEBOUNCE_MS, useDebounce } from '@/services/hooks/use-debounce';
import { userMentionUrl } from '@/utils/mentions';

import {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxGroup,
    InlineComboboxInput,
    InlineComboboxItem,
} from './inline-combobox';

const MIN_SEARCH_LENGTH = 2;

export function UserSearchInputElement(props: PlateElementProps) {
    const { children, editor, element } = props;
    const [search, setSearch] = React.useState('');
    const [debouncedSearch] = useDebounce({
        value: search,
        delay: DEBOUNCE_MS.input,
    });

    const isTooShort = debouncedSearch.trim().length < MIN_SEARCH_LENGTH;
    const isPending = search !== debouncedSearch;

    const { data: users, isFetching } = useQuery({
        ...searchUsersOptions({ body: { query: debouncedSearch } }),
        enabled: !isTooShort,
    });

    const mentionable = users?.filter((user) => user.username);

    return (
        <PlateElement as="span" {...props}>
            <InlineCombobox
                value={search}
                element={element}
                filter={false}
                setValue={setSearch}
                trigger="@"
                hideWhenNoValue
            >
                <InlineComboboxInput />

                <InlineComboboxContent>
                    <InlineComboboxEmpty>
                        {isTooShort
                            ? 'Введіть щонайменше 2 символи'
                            : isFetching || isPending
                              ? 'Завантаження...'
                              : 'Користувачів не знайдено'}
                    </InlineComboboxEmpty>

                    <InlineComboboxGroup>
                        {mentionable?.map((user) => (
                            <InlineComboboxItem
                                key={user.reference}
                                value={user.username ?? ''}
                                onClick={() =>
                                    editor.tf.insertNodes(
                                        createLinkNode(editor, {
                                            url: userMentionUrl(user.reference),
                                            text: `@${user.username}`,
                                        }),
                                    )
                                }
                            >
                                <Avatar className="size-5">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                        {user.username?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                {user.username}
                            </InlineComboboxItem>
                        ))}
                    </InlineComboboxGroup>
                </InlineComboboxContent>
            </InlineCombobox>

            {children}
        </PlateElement>
    );
}
