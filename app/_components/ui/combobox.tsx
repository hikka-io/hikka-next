import { ChevronsUpDown } from 'lucide-react';
import {
    Dispatch,
    ReactNode,
    SetStateAction,
    forwardRef,
    useRef,
    useState,
} from 'react';

import { Badge } from '@/app/_components/ui/badge';
import { Button, ButtonProps } from '@/app/_components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/app/_components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverPortal,
    PopoverTrigger,
} from '@/app/_components/ui/popover';
import { ScrollArea, ScrollBar } from '@/app/_components/ui/scroll-area';

import { Checkbox } from './checkbox';

export interface ComboboxOption {
    value: string;
    label: React.ReactNode;
}

type ComboboxPropsSingle = {
    options: ComboboxOption[];
    emptyText?: string;
    clearable?: boolean;
    selectPlaceholder?: string;
    searchPlaceholder?: string;
    multiple?: false;
    value?: string;
    onChange?: (value: string) => void;
};

type ComboboxPropsMultiple = {
    options: ComboboxOption[];
    emptyText?: string;
    clearable?: boolean;
    selectPlaceholder?: string;
    searchPlaceholder?: string;
    multiple: true;
    value?: string[];
    onChange?: (value: string[]) => void;
};

export type ComboboxProps = (ComboboxPropsSingle | ComboboxPropsMultiple) & {
    renderToggle?: (
        open: boolean,
        setOpen: Dispatch<SetStateAction<boolean>>,
        value: string | string[] | undefined,
    ) => ReactNode;
    renderValue?: (option: ComboboxOption | ComboboxOption[] | undefined) => ReactNode;
    toggleProps?: ButtonProps;
    disableCheckbox?: boolean;
    align?: "center" | "start" | "end";
    side?: "top" | "right" | "bottom" | "left";
};

export const handleSingleSelect = (
    props: ComboboxPropsSingle,
    option: ComboboxOption,
) => {
    if (props.clearable) {
        props.onChange?.(option.value === props.value ? '' : option.value);
    } else {
        props.onChange?.(option.value);
    }
};

export const handleMultipleSelect = (
    props: ComboboxPropsMultiple,
    option: ComboboxOption,
) => {
    if (props.value?.includes(option.value)) {
        if (!props.clearable && props.value.length === 1) return false;
        props.onChange?.(props.value.filter((value) => value !== option.value));
    } else {
        props.onChange?.([...(props.value ?? []), option.value]);
    }
};

export const Combobox = forwardRef(
    (props: ComboboxProps, ref: React.ForwardedRef<HTMLInputElement>) => {
        const rootRef = useRef<HTMLDivElement>(null);
        const [open, setOpen] = useState(false);

        const getOptionsByValue = () => {
            if (props.multiple) {
                return props.options.filter((o) => props.value?.some(v => v === o.value));
            }

            return props.options.filter((o) => o.value === props.value);
        }

        return (
            <div data-select={true} className="relative" ref={rootRef}>
                <Popover open={open} onOpenChange={setOpen}>
                    {props.renderToggle ? (
                        props.renderToggle(open, setOpen, props.value)
                    ) : (
                        <PopoverTrigger asChild>
                            <Button
                                role="combobox"
                                variant="outline"
                                aria-expanded={open}
                                className="w-full justify-between"
                                {...props.toggleProps}
                            >
                                {!props.renderValue ? (props.multiple ?
                                    (props.value && props.value?.length > 0 && (
                                        <div className="inline-flex gap-2">
                                            {getOptionsByValue().map((v, i) => i < 1 ? (
                                                <Badge variant="outline" key={v.value}>{v.label}</Badge>
                                            ) : (i === 1 ? (<Badge variant="outline" key="final-badge">...</Badge>) : null))}
                                        </div>
                                        )) : (props.value && <div className="inline-flex gap-2">{getOptionsByValue()[0].label}</div>)) : props.renderValue(getOptionsByValue()[0])}


                                {(!props.value || props.value.length === 0) && (
                                        <span className="line-clamp-1 text-left font-normal text-muted-foreground">
                                            {props.selectPlaceholder ??
                                                'Виберіть опцію'}
                                        </span>
                                    )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                    )}
                    <PopoverPortal container={rootRef.current}>
                        <PopoverContent side={props.side} align={props.align || "start"} className="p-0">
                            <Command
                                filter={(value, search) => {
                                    const label =
                                        props.options?.find(
                                            (option) => option.value === value,
                                        )?.label || '';
                                    if (
                                        typeof label === 'string' &&
                                        label.toLowerCase().includes(search.toLowerCase())
                                    )
                                        return 1;
                                    return 0;
                                }}
                            >
                                {props.multiple && (
                                    <CommandInput
                                        placeholder={
                                            props.searchPlaceholder ??
                                            'Search for an option'
                                        }
                                    />
                                )}
                                <CommandEmpty>
                                    {props.emptyText ?? 'No results found'}
                                </CommandEmpty>
                                <CommandGroup>
                                    <ScrollArea>
                                        <ScrollBar orientation="vertical" />
                                        <div className="max-h-60">
                                            {props.options.map((option) => (
                                                <CommandItem
                                                    className="gap-2"
                                                    title={
                                                        option.label as string
                                                    }
                                                    key={option.value}
                                                    value={option.value}
                                                    onSelect={(
                                                        selectedValue,
                                                    ) => {
                                                        console.log(selectedValue);
                                                        const option =
                                                            props.options.find(
                                                                (option) =>
                                                                    option.value
                                                                        .toLowerCase()
                                                                        .trim() ===
                                                                    selectedValue,
                                                            );

                                                        if (!option)
                                                            return null;

                                                        if (props.multiple) {
                                                            handleMultipleSelect(
                                                                props,
                                                                option,
                                                            );
                                                        } else {
                                                            handleSingleSelect(
                                                                props,
                                                                option,
                                                            );

                                                            setOpen(false);
                                                        }
                                                    }}
                                                >
                                                    {!props.disableCheckbox && <Checkbox
                                                        className="border-secondary"
                                                        checked={
                                                            (!props.multiple &&
                                                                props.value ===
                                                                    option.value) ||
                                                            (props.multiple &&
                                                                props.value?.includes(
                                                                    option.value,
                                                                ))
                                                        }
                                                    />}
                                                    {option.label}
                                                </CommandItem>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </PopoverPortal>
                </Popover>
            </div>
        );
    },
);