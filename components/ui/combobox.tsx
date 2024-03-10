import { ChevronsUpDown } from 'lucide-react';
import {
    Dispatch,
    ForwardedRef,
    Fragment,
    ReactNode,
    SetStateAction,
    forwardRef,
    useRef,
    useState,
} from 'react';

import { Badge } from '@/components/ui/badge';
import { Button, ButtonProps } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverPortal,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/utils';

import { Checkbox } from './checkbox';

export interface ComboboxOption {
    value: string;
    label: ReactNode;
    disableCheckbox?: boolean;
    title?: string;
    group?: {
        label?: string;
        value: string;
    };
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
    renderValue?: (
        option: ComboboxOption | ComboboxOption[] | undefined,
    ) => ReactNode;
    toggleProps?: ButtonProps;
    disableCheckbox?: boolean;
    align?: 'center' | 'start' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
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
    (props: ComboboxProps, ref: ForwardedRef<HTMLInputElement>) => {
        const {
            options,
            multiple,
            value,
            className,
            renderToggle,
            toggleProps,
            renderValue,
            selectPlaceholder,
            searchPlaceholder,
            side,
            align,
            emptyText,
            disableCheckbox,
        } = props;

        const rootRef = useRef<HTMLDivElement>(null);
        const [open, setOpen] = useState(false);

        const getOptionsByValue = () => {
            if (multiple) {
                return options.filter((o) => value?.some((v) => v === o.value));
            }

            return options.filter((o) => o.value === value);
        };

        const getOptionsByGroup = () => {
            return options.reduce(
                (acc, option) => {
                    if (option.group) {
                        if (!acc[option.group.value]) {
                            acc[option.group.value] = {
                                label: option.group.label,
                                options: [],
                            };
                        }

                        acc[option.group.value].options.push(option);
                    } else {
                        if (!acc.default) {
                            acc.default = {
                                label: undefined,
                                options: [],
                            };
                        }

                        acc.default.options.push(option);
                    }

                    return acc;
                },
                {} as Record<
                    string,
                    { label?: string; options: ComboboxOption[] }
                >,
            );
        };

        const optionsByGroup = getOptionsByGroup();

        return (
            <div
                data-select={true}
                className={cn('relative', className)}
                ref={rootRef}
            >
                <Popover open={open} onOpenChange={setOpen}>
                    {renderToggle ? (
                        renderToggle(open, setOpen, value)
                    ) : (
                        <PopoverTrigger asChild>
                            <Button
                                role="combobox"
                                variant="outline"
                                aria-expanded={open}
                                className="w-full justify-between"
                                {...toggleProps}
                            >
                                {!renderValue
                                    ? multiple
                                        ? value &&
                                          value?.length > 0 && (
                                              <div className="inline-flex gap-2">
                                                  {getOptionsByValue().map(
                                                      (v, i) =>
                                                          i < 1 ? (
                                                              <Badge
                                                                  variant="outline"
                                                                  key={v.value}
                                                              >
                                                                  {v.label}
                                                              </Badge>
                                                          ) : i === 1 ? (
                                                              <Badge
                                                                  variant="outline"
                                                                  key="final-badge"
                                                              >
                                                                  ...
                                                              </Badge>
                                                          ) : null,
                                                  )}
                                              </div>
                                          )
                                        : value && (
                                              <div className="inline-flex gap-2">
                                                  {getOptionsByValue()[0].label}
                                              </div>
                                          )
                                    : renderValue(getOptionsByValue()[0])}

                                {(!value || value.length === 0) && (
                                    <span className="line-clamp-1 text-left font-normal text-muted-foreground">
                                        {selectPlaceholder ?? 'Виберіть опцію'}
                                    </span>
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                    )}
                    <PopoverPortal container={rootRef.current}>
                        <PopoverContent
                            side={side}
                            align={align || 'start'}
                            className="p-0"
                        >
                            <Command
                                filter={(value, search) => {
                                    const label =
                                        options?.find(
                                            (option) => option.value === value,
                                        )?.label || '';
                                    if (
                                        typeof label === 'string' &&
                                        label
                                            .toLowerCase()
                                            .includes(search.toLowerCase())
                                    )
                                        return 1;
                                    return 0;
                                }}
                            >
                                {multiple && (
                                    <CommandInput
                                        placeholder={
                                            searchPlaceholder ?? 'Пошук опції'
                                        }
                                    />
                                )}
                                <CommandEmpty>
                                    {emptyText ?? 'Результатів не знайдено'}
                                </CommandEmpty>
                                <ScrollArea>
                                    <ScrollBar orientation="vertical" />
                                    <div className="max-h-72">
                                        {Object.keys(optionsByGroup).map(
                                            (group, index) => {
                                                const groupOptions =
                                                    optionsByGroup[group]
                                                        .options;
                                                return (
                                                    <Fragment key={group}>
                                                        {index !== 0 && (
                                                            <CommandSeparator />
                                                        )}
                                                        <CommandGroup
                                                            title={
                                                                optionsByGroup[
                                                                    group
                                                                ].label
                                                            }
                                                            heading={
                                                                optionsByGroup[
                                                                    group
                                                                ].label
                                                            }
                                                        >
                                                            {groupOptions.map(
                                                                (option) => (
                                                                    <CommandItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        className="gap-2"
                                                                        title={
                                                                            option.title ||
                                                                            (option.label as string)
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                        onSelect={(
                                                                            selectedValue,
                                                                        ) => {
                                                                            console.log(
                                                                                selectedValue,
                                                                            );
                                                                            const option =
                                                                                options.find(
                                                                                    (
                                                                                        option,
                                                                                    ) =>
                                                                                        option.value
                                                                                            .toLowerCase()
                                                                                            .trim() ===
                                                                                        selectedValue,
                                                                                );

                                                                            if (
                                                                                !option
                                                                            )
                                                                                return null;

                                                                            if (
                                                                                multiple
                                                                            ) {
                                                                                handleMultipleSelect(
                                                                                    props,
                                                                                    option,
                                                                                );
                                                                            } else {
                                                                                handleSingleSelect(
                                                                                    props,
                                                                                    option,
                                                                                );

                                                                                setOpen(
                                                                                    false,
                                                                                );
                                                                            }
                                                                        }}
                                                                    >
                                                                        {!disableCheckbox &&
                                                                            !option.disableCheckbox && (
                                                                                <Checkbox
                                                                                    className="border-secondary"
                                                                                    checked={
                                                                                        (!multiple &&
                                                                                            value ===
                                                                                                option.value) ||
                                                                                        (multiple &&
                                                                                            value?.includes(
                                                                                                option.value,
                                                                                            ))
                                                                                    }
                                                                                />
                                                                            )}
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </CommandItem>
                                                                ),
                                                            )}
                                                        </CommandGroup>
                                                    </Fragment>
                                                );
                                            },
                                        )}
                                    </div>
                                </ScrollArea>
                            </Command>
                        </PopoverContent>
                    </PopoverPortal>
                </Popover>
            </div>
        );
    },
);
