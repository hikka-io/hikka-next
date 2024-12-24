'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import {
    Primitive,
    type PrimitivePropsWithRef,
} from '@radix-ui/react-primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { ChevronsUpDown, X } from 'lucide-react';
import React, { FC, Fragment, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { cn } from '@/utils/utils';

import { Badge } from './badge';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from './command';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './tooltip';

export interface SelectOptionItem {
    value: string;
    label?: React.ReactNode;
}

interface SelectContextValue {
    value: string[];

    open: boolean;
    filter?: boolean | ((keyword: string, current: string) => boolean);
    disabled?: boolean;
    maxCount?: number;
    itemCache?: Record<string, SelectOptionItem>;
    multiple?: boolean;

    onSelect(value: string, item: SelectOptionItem): void;

    onDeselect(value: string, item: SelectOptionItem): void;

    onSearch?(keyword: string | undefined): void;

    setItemCache(value: string, item: SelectOptionItem): void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(
    undefined,
);

const useSelect = () => {
    const context = React.useContext(SelectContext);

    if (!context) {
        throw new Error('useSelect must be used within SelectProvider');
    }

    return context;
};

export type SelectProps = React.ComponentPropsWithoutRef<
    typeof PopoverPrimitive.Root
> & {
    value?: string[];
    onValueChange?(value: string[], items: SelectOptionItem[]): void;
    onSelect?(value: string, item: SelectOptionItem): void;
    onDeselect?(value: string, item: SelectOptionItem): void;
    defaultValue?: string[];
    onSearch?(keyword: string | undefined): void;
    filter?: boolean | ((keyword: string, current: string) => boolean);
    disabled?: boolean;
    maxCount?: number;
    multiple?: boolean;
};

const Select: React.FC<SelectProps> = ({
    value: valueProp,
    onValueChange: onValueChangeProp,
    onDeselect: onDeselectProp,
    onSelect: onSelectProp,
    defaultValue,
    open: openProp,
    onOpenChange,
    defaultOpen,
    onSearch,
    filter,
    disabled,
    maxCount,
    multiple,
    ...popoverProps
}) => {
    const [itemCache, setItemCache] =
        React.useState<Record<string, SelectOptionItem>>();

    const handleValueChange = React.useCallback(
        (state: string[]) => {
            if (onValueChangeProp) {
                const items = state.map((value) => itemCache![value]);

                onValueChangeProp(state, items);
            }
        },
        [onValueChangeProp, itemCache],
    );

    const [value, setValue] = useControllableState({
        prop: valueProp,
        defaultProp: defaultValue,
        onChange: handleValueChange,
    });

    const [open, setOpen] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen,
        onChange: onOpenChange,
    });

    const handleSelect = React.useCallback(
        (value: string, item: SelectOptionItem) => {
            if (!multiple) {
                setValue([value]);
                setOpen(false);
                return;
            }

            setValue((prev) => {
                if (prev?.includes(value)) {
                    return prev;
                }

                onSelectProp?.(value, item);

                return prev ? [...prev, value] : [value];
            });
        },
        [onSelectProp, setValue, multiple],
    );

    const handleDeselect = React.useCallback(
        (value: string, item: SelectOptionItem) => {
            setValue((prev) => {
                if (!prev || !prev.includes(value)) {
                    return prev;
                }

                onDeselectProp?.(value, item);

                return prev.filter((v) => v !== value);
            });
        },
        [onDeselectProp, setValue],
    );

    const handleSetItemCache = React.useCallback(
        (value: string, item: SelectOptionItem) => {
            setItemCache((prev) => {
                return {
                    ...prev,
                    [value]: item,
                };
            });
        },
        [setItemCache],
    );

    const contextValue = React.useMemo(() => {
        return {
            value: value || [],
            open: open || false,
            onSearch,
            filter,
            disabled,
            maxCount,
            onSelect: handleSelect,
            onDeselect: handleDeselect,
            setItemCache: handleSetItemCache,
            itemCache,
            multiple,
        };
    }, [
        value,
        open,
        onSearch,
        filter,
        disabled,
        maxCount,
        itemCache,
        handleSelect,
        handleDeselect,
        handleSetItemCache,
        multiple,
    ]);

    return (
        <SelectContext.Provider value={contextValue}>
            <PopoverPrimitive.Root
                {...popoverProps}
                open={open}
                onOpenChange={setOpen}
            />
        </SelectContext.Provider>
    );
};

Select.displayName = 'Select';

type SelectTriggerElement = React.ComponentRef<typeof Primitive.div>;

interface SelectTriggerProps
    extends PrimitivePropsWithRef<typeof Primitive.div> {}

const PreventClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
};

const SelectTrigger = React.forwardRef<
    SelectTriggerElement,
    SelectTriggerProps
>(({ className, children, asChild, ...props }, forwardedRef) => {
    const { disabled } = useSelect();

    return (
        <PopoverPrimitive.Trigger ref={forwardedRef as any} asChild>
            <div
                aria-disabled={disabled}
                data-disabled={disabled}
                {...props}
                className={cn(
                    !asChild &&
                        buttonVariants({ variant: 'outline', size: 'default' }),
                    !asChild &&
                        'flex h-auto min-h-12 items-center justify-between',
                    disabled
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer',
                    className,
                )}
                onClick={disabled ? PreventClick : props.onClick}
                onTouchStart={disabled ? PreventClick : props.onTouchStart}
            >
                {children}
            </div>
        </PopoverPrimitive.Trigger>
    );
});

SelectTrigger.displayName = 'SelectTrigger';

const SelectIcon: FC<PrimitivePropsWithRef<'svg'>> = ({
    className,
    ...props
}) => (
    <ChevronsUpDown
        aria-hidden
        className={cn('size-4 shrink-0 opacity-50', className)}
        {...props}
    />
);

SelectIcon.displayName = 'SelectIcon';

interface SelectValueProps extends PrimitivePropsWithRef<typeof Primitive.div> {
    placeholder?: string;
    maxDisplay?: number;
    maxItemLength?: number;
}

const SelectValue = React.forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    SelectValueProps
>(
    (
        { className, placeholder, maxDisplay, maxItemLength, ...props },
        forwardRef,
    ) => {
        const { value, itemCache, onDeselect, multiple } = useSelect();
        const [firstRendered, setFirstRendered] = React.useState(false);

        const renderRemain =
            maxDisplay && value.length > maxDisplay
                ? value.length - maxDisplay
                : 0;
        const renderItems = renderRemain ? value.slice(0, maxDisplay) : value;

        React.useLayoutEffect(() => {
            setFirstRendered(true);
        }, []);

        if (!value.length || !firstRendered) {
            return (
                <Fragment>
                    <p className="pointer-events-none flex-1 truncate text-muted-foreground">
                        {placeholder}
                    </p>
                    <SelectIcon className="!size-4" />
                </Fragment>
            );
        }

        if (!multiple) {
            const item = itemCache ? itemCache[value[0]] : undefined;

            return (
                <Fragment>
                    {item?.label ? (
                        item?.label
                    ) : (
                        <span className="pointer-events-none truncate">
                            {value[0]}
                        </span>
                    )}

                    <SelectIcon className="!size-4" />
                </Fragment>
            );
        }

        return (
            <Fragment>
                <TooltipProvider delayDuration={300}>
                    <div
                        className={cn(
                            'flex flex-1 flex-wrap items-center gap-1.5 overflow-x-hidden',
                            className,
                        )}
                        {...props}
                        ref={forwardRef}
                    >
                        {renderItems.map((value) => {
                            const item = itemCache
                                ? itemCache[value]
                                : undefined;

                            const content = item?.label || value;

                            const child =
                                maxItemLength &&
                                typeof content === 'string' &&
                                content.length > maxItemLength
                                    ? `${content.slice(0, maxItemLength)}...`
                                    : content;

                            const el = (
                                <Badge
                                    variant="outline"
                                    key={value}
                                    className="group/select-badge cursor-pointer rounded-full pr-1.5"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onDeselect(value, item!);
                                    }}
                                >
                                    <span>{child}</span>
                                    <X className="ml-1 size-3 text-muted-foreground group-hover/select-badge:text-foreground" />
                                </Badge>
                            );

                            if (child !== content) {
                                return (
                                    <Tooltip key={value}>
                                        <TooltipTrigger className="inline-flex">
                                            {el}
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="bottom"
                                            align="start"
                                            className="z-[51]"
                                        >
                                            {content}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            }

                            return el;
                        })}
                        {renderRemain ? (
                            <span className="text-xs leading-4 text-muted-foreground">
                                +{renderRemain}
                            </span>
                        ) : null}
                    </div>
                </TooltipProvider>
                <SelectIcon />
            </Fragment>
        );
    },
);

const SelectSearch = React.forwardRef<
    React.ComponentRef<typeof CommandInput>,
    PrimitivePropsWithRef<typeof CommandInput>
>((props, ref) => {
    const { onSearch } = useSelect();

    return <CommandInput ref={ref} {...props} onValueChange={onSearch} />;
});

SelectSearch.displayName = 'SelectSearch';

const SelectList = React.forwardRef<
    React.ComponentRef<typeof CommandList>,
    PrimitivePropsWithRef<typeof CommandList>
>(({ className, ...props }, ref) => {
    return (
        <CommandList
            ref={ref}
            className={cn('max-h-[unset] p-0', className)}
            {...props}
        />
    );
});

SelectList.displayName = 'SelectList';

interface SelectContentProps
    extends PrimitivePropsWithRef<typeof PopoverPrimitive.Content> {}

const SelectContent = React.forwardRef<
    React.ComponentRef<typeof PopoverPrimitive.Content>,
    SelectContentProps
>(({ className, children, ...props }, ref) => {
    const context = useSelect();

    const fragmentRef = React.useRef<DocumentFragment>(null);

    const [firstRendered, setFirstRendered] = React.useState(false);

    React.useLayoutEffect(() => {
        setFirstRendered(true);
    }, []);

    if (!fragmentRef.current && firstRendered) {
        fragmentRef.current = document.createDocumentFragment();
    }

    if (!context.open) {
        return fragmentRef.current
            ? createPortal(<Command>{children}</Command>, fragmentRef.current)
            : null;
    }

    return (
        <PopoverPrimitive.Content
            ref={ref}
            align="start"
            sideOffset={4}
            collisionPadding={10}
            className={cn(
                'z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            )}
            style={
                {
                    '--radix-select-content-transform-origin':
                        'var(--radix-popper-transform-origin)',
                    '--radix-select-content-available-width':
                        'var(--radix-popper-available-width)',
                    '--radix-select-content-available-height':
                        'var(--radix-popper-available-height)',
                    '--radix-select-trigger-width':
                        'var(--radix-popper-anchor-width)',
                    '--radix-select-trigger-height':
                        'var(--radix-popper-anchor-height)',
                } as any
            }
            {...props}
        >
            <Command
                className={cn(
                    'max-h-96 w-full min-w-[var(--radix-select-trigger-width)]',
                    className,
                )}
                shouldFilter={!context.onSearch}
            >
                {children}
            </Command>
        </PopoverPrimitive.Content>
    );
});

type SelectItemProps = PrimitivePropsWithRef<typeof CommandItem> &
    Partial<SelectOptionItem> & {
        onSelect?: (value: string, item: SelectOptionItem) => void;
        onDeselect?: (value: string, item: SelectOptionItem) => void;
        disableCheckbox?: boolean;
    };

const SelectItem = React.forwardRef<
    React.ComponentRef<typeof CommandItem>,
    SelectItemProps
>(
    (
        {
            value,
            onSelect: onSelectProp,
            onDeselect: onDeselectProp,
            children,
            label,
            disabled: disabledProp,
            className,
            disableCheckbox,
            ...props
        },
        forwardedRef,
    ) => {
        const {
            value: contextValue,
            maxCount,
            onSelect,
            onDeselect,
            setItemCache,
            multiple,
        } = useSelect();

        const item = React.useMemo(() => {
            return value
                ? {
                      value,
                      label: label || children,
                  }
                : undefined;
        }, [value, label, children]);

        const selected = Boolean(value && contextValue.includes(value));

        React.useEffect(() => {
            if (value) {
                setItemCache(value, item!);
            }
        }, [selected, value, item]);

        const disabled = Boolean(
            disabledProp ||
                (!selected && maxCount && contextValue.length >= maxCount),
        );

        const handleClick = () => {
            if (selected) {
                onDeselectProp?.(value!, item!);

                if (multiple) {
                    onDeselect(value!, item!);
                    return;
                }
            } else {
                setItemCache(value!, item!);
                onSelectProp?.(value!, item!);
                onSelect(value!, item!);
            }
        };

        return (
            <CommandItem
                {...props}
                value={value}
                className={cn(
                    disabled && 'cursor-not-allowed text-muted-foreground',
                    'gap-2',
                    className,
                )}
                keywords={item ? [String(item.label)] : undefined}
                disabled={disabled}
                onSelect={!disabled && value ? handleClick : undefined}
                ref={forwardedRef}
            >
                {!disableCheckbox && (
                    <span className="size-4">
                        <Checkbox
                            className="border-secondary"
                            checked={selected}
                        />
                    </span>
                )}

                <span className="truncate">{children || label || value}</span>
            </CommandItem>
        );
    },
);

const SelectGroup = React.forwardRef<
    React.ComponentRef<typeof CommandGroup>,
    PrimitivePropsWithRef<typeof CommandGroup>
>((props, forwardRef) => {
    return <CommandGroup {...props} ref={forwardRef} />;
});

SelectGroup.displayName = 'SelectGroup';

const SelectSeparator = React.forwardRef<
    React.ComponentRef<typeof CommandSeparator>,
    PrimitivePropsWithRef<typeof CommandSeparator>
>((props, forwardRef) => {
    return <CommandSeparator {...props} ref={forwardRef} />;
});

SelectSeparator.displayName = 'SelectSeparator';

const SelectEmpty = React.forwardRef<
    React.ComponentRef<typeof CommandEmpty>,
    PrimitivePropsWithRef<typeof CommandEmpty>
>(({ children = 'No Content', className, ...props }, forwardRef) => {
    return (
        <CommandEmpty
            {...props}
            className={cn(
                className,
                'py-4 text-center text-sm text-muted-foreground',
            )}
            ref={forwardRef}
        >
            {children}
        </CommandEmpty>
    );
});

SelectEmpty.displayName = 'SelectEmpty';
`
|]`;
export interface SelectOptionSeparator {
    type: 'separator';
}

export interface SelectOptionGroup {
    heading?: React.ReactNode;
    value?: string;
    children: SelectOption[];
}

export type SelectOption =
    | Pick<
          SelectItemProps,
          'value' | 'label' | 'disabled' | 'onSelect' | 'onDeselect'
      >
    | SelectOptionSeparator
    | SelectOptionGroup;

const renderSelectOptions = (list: SelectOption[]) => {
    return list.map((option, index) => {
        if ('type' in option) {
            if (option.type === 'separator') {
                return <SelectSeparator key={index} />;
            }

            return null;
        }

        if ('children' in option) {
            return (
                <SelectGroup
                    key={option.value || index}
                    value={option.value}
                    heading={option.heading}
                >
                    {renderSelectOptions(option.children)}
                </SelectGroup>
            );
        }

        return (
            <SelectItem key={option.value} {...option}>
                {option.label}
            </SelectItem>
        );
    });
};

type Option = { value: string; label: string | ReactNode; group: string };

const groupOptions = (options: Option[]) => {
    return options.reduce(
        (acc, item) => {
            const group = acc.find(
                (g) => !('type' in g) && g.heading === item.group,
            );
            if (group && !('type' in group)) {
                group.children.push(item);
            } else {
                if (acc.length > 0) {
                    acc.push({ type: 'separator' });
                }

                acc.push({ heading: item.group, children: [item] });
            }
            return acc;
        },
        [] as (SelectOptionGroup | SelectOptionSeparator)[],
    );
};

export {
    groupOptions,
    renderSelectOptions,
    Select,
    SelectContent,
    SelectEmpty,
    SelectGroup,
    SelectIcon,
    SelectItem,
    SelectList,
    SelectSearch,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
