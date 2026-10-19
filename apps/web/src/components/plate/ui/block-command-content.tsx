import { type ComponentProps, Fragment, type ReactNode } from 'react';

import { CheckIcon } from 'lucide-react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { PopoverContent } from '@/components/ui/popover';

export type BlockCommandItem = {
    icon: ReactNode;
    label: string;
    value: string;
    onSelect: () => void;
    checked?: boolean;
};

export type BlockCommandGroup = {
    group: string;
    items: BlockCommandItem[];
};

type Props = {
    placeholder: string;
    groups: BlockCommandGroup[];
    finalFocus?: ComponentProps<typeof PopoverContent>['finalFocus'];
};

/** The gutter menus' popup: a filter field card above a card of grouped commands. */
export function BlockCommandContent({
    placeholder,
    groups,
    finalFocus,
}: Props) {
    const visibleGroups = groups.filter(({ items }) => items.length > 0);

    return (
        <PopoverContent
            align="start"
            finalFocus={finalFocus}
            className="w-60 gap-0 border-0 bg-transparent p-0 shadow-none"
            data-plate-prevent-deselect
        >
            <Command loop className="gap-2 overflow-visible bg-transparent">
                <CommandInput
                    placeholder={placeholder}
                    containerClassName="rounded-lg border-0 bg-popover px-2.5 shadow-md ring-1 ring-border"
                    className="h-9 py-2"
                />
                <CommandList className="rounded-lg bg-popover p-1 shadow-md ring-1 ring-border">
                    <CommandEmpty className="p-2 text-muted-foreground">
                        Нічого не знайдено
                    </CommandEmpty>
                    {visibleGroups.map(({ group, items }, index) => (
                        <Fragment key={group}>
                            {index > 0 && <CommandSeparator className="my-1" />}
                            <CommandGroup
                                heading={group}
                                className="p-0! **:[[cmdk-group-heading]]:p-2"
                            >
                                {items.map(
                                    ({
                                        icon,
                                        label,
                                        value,
                                        onSelect,
                                        checked,
                                    }) => (
                                        <CommandItem
                                            key={value}
                                            value={label}
                                            className="rounded-md"
                                            onSelect={onSelect}
                                        >
                                            {icon}
                                            {label}
                                            {checked && (
                                                <CheckIcon className="ml-auto" />
                                            )}
                                        </CommandItem>
                                    ),
                                )}
                            </CommandGroup>
                        </Fragment>
                    ))}
                </CommandList>
            </Command>
        </PopoverContent>
    );
}
