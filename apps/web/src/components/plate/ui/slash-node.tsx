import { FilmIcon, ImageIcon } from 'lucide-react';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { openImagePicker } from './image-group-add-image';
import {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxGroup,
    InlineComboboxGroupLabel,
    InlineComboboxInput,
    InlineComboboxItem,
} from './inline-combobox';
import {
    ARTICLE_INSERT_GROUPS,
    type InsertGroup,
    useDisabledInsertTypes,
} from './insert-block-items';
import { getVideoDialog } from './video-dialog';

const MEDIA_GROUP: InsertGroup = {
    group: 'Медіа',
    items: [
        {
            icon: <ImageIcon />,
            label: 'Зображення',
            value: 'image',
            onSelect: (editor) => openImagePicker(editor),
        },
        {
            icon: <FilmIcon />,
            label: 'Відео з YouTube',
            value: 'video',
            onSelect: (editor) => getVideoDialog(editor)?.(),
        },
    ],
};

const SLASH_GROUPS = [...ARTICLE_INSERT_GROUPS, MEDIA_GROUP];

export function SlashInputElement(props: PlateElementProps) {
    const { children, editor, element } = props;
    const disabledTypes = useDisabledInsertTypes();

    return (
        <PlateElement as="span" {...props}>
            <InlineCombobox
                element={element}
                trigger="/"
                restoreOnCancel={!element.fromGutter}
            >
                <InlineComboboxInput />

                <InlineComboboxContent className="w-56">
                    <InlineComboboxEmpty>
                        Нічого не знайдено
                    </InlineComboboxEmpty>

                    {SLASH_GROUPS.map(({ group, items }) => (
                        <InlineComboboxGroup key={group}>
                            <InlineComboboxGroupLabel>
                                {group}
                            </InlineComboboxGroupLabel>

                            {items
                                .filter(
                                    ({ value }) => !disabledTypes.has(value),
                                )
                                .map(({ icon, label, value, onSelect }) => (
                                    <InlineComboboxItem
                                        key={value}
                                        value={value}
                                        label={label}
                                        group={group}
                                        onClick={() => onSelect(editor, value)}
                                    >
                                        {icon}
                                        {label}
                                    </InlineComboboxItem>
                                ))}
                        </InlineComboboxGroup>
                    ))}
                </InlineComboboxContent>
            </InlineCombobox>

            {children}
        </PlateElement>
    );
}
