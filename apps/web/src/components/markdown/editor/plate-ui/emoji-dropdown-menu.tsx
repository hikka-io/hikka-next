'use client';

import {
    type EmojiDropdownMenuOptions,
    useEmojiDropdownMenuState,
} from '@udecode/plate-emoji/react';
import { Smile } from 'lucide-react';
import React from 'react';

import { emojiCategoryIcons, emojiSearchIcons } from './emoji-icons';
import { EmojiPicker } from './emoji-picker';
import { EmojiToolbarDropdown } from './emoji-toolbar-dropdown';
import { ToolbarButton } from './toolbar';

type EmojiDropdownMenuProps = {
    options?: EmojiDropdownMenuOptions;
} & React.ComponentPropsWithoutRef<typeof ToolbarButton>;

const i18n = {
    search: 'Пошук',
    clear: 'Очистити',
    categories: {
        people: 'Люди',
        nature: 'Природа',
        foods: 'Їжа',
        activity: 'Активності',
        places: 'Місця',
        objects: "Об'єкти",
        symbols: 'Символи',
        flags: 'Прапори',
        custom: 'Користувацькі',
        frequent: 'Часті використовувані',
    },
    pick: 'Вибрати',
    searchResult: 'Результати пошуку',
    searchNoResultsTitle: 'Нічого не знайдено',
    searchNoResultsSubtitle: 'Спробуйте інший запит',
    skins: {
        1: 'Світлий',
        2: 'Світлий-середній',
        3: 'Середній',
        4: 'Темний-середній',
        5: 'Темний',
        6: 'Вибрати шкіру',
        choose: 'Вибрати шкіру',
    },
};

export function EmojiDropdownMenu({
    options,
    ...props
}: EmojiDropdownMenuProps) {
    const { emojiPickerState, isOpen, setIsOpen } =
        useEmojiDropdownMenuState(options);

    return (
        <EmojiToolbarDropdown
            control={
                <ToolbarButton
                    pressed={isOpen}
                    tooltip="Емоджі"
                    isDropdown
                    {...props}
                >
                    <Smile />
                </ToolbarButton>
            }
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <EmojiPicker
                {...emojiPickerState}
                icons={{
                    categories: emojiCategoryIcons,
                    search: emojiSearchIcons,
                }}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                settings={options?.settings}
                i18n={i18n}
            />
        </EmojiToolbarDropdown>
    );
}
