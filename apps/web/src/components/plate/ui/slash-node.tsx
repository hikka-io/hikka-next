import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

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
    BLOCK_MENU_GROUPS,
    useDisabledInsertTypes,
} from './insert-block-items';

export function SlashInputElement(props: PlateElementProps) {
    const { children, editor, element } = props;
    const disabledTypes = useDisabledInsertTypes();

    return (
        <PlateElement
            as="span"
            className="rounded-md bg-muted px-1.5 py-0.5"
            {...props}
        >
            <InlineCombobox element={element} trigger="/">
                <InlineComboboxInput />

                <InlineComboboxContent className="w-56">
                    <InlineComboboxEmpty>
                        Нічого не знайдено
                    </InlineComboboxEmpty>

                    {BLOCK_MENU_GROUPS.map(({ group, items }) => (
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
