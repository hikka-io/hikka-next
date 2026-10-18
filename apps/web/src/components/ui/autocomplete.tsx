import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';

import { cn } from '@/utils/cn';

const Autocomplete = AutocompletePrimitive.Root;

function AutocompleteInput({
    className,
    ...props
}: AutocompletePrimitive.Input.Props) {
    return (
        <AutocompletePrimitive.Input
            data-slot="autocomplete-input"
            className={cn('outline-none', className)}
            {...props}
        />
    );
}

function AutocompleteContent({
    className,
    align = 'start',
    side = 'bottom',
    sideOffset = 4,
    ...props
}: AutocompletePrimitive.Popup.Props &
    Pick<
        AutocompletePrimitive.Positioner.Props,
        'align' | 'side' | 'sideOffset'
    >) {
    return (
        <AutocompletePrimitive.Portal>
            <AutocompletePrimitive.Positioner
                align={align}
                side={side}
                sideOffset={sideOffset}
                className="isolate z-50 outline-none"
            >
                <AutocompletePrimitive.Popup
                    data-slot="autocomplete-content"
                    className={cn(
                        'max-h-(--available-height) min-w-48 origin-(--transform-origin) overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-border transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0',
                        className,
                    )}
                    {...props}
                />
            </AutocompletePrimitive.Positioner>
        </AutocompletePrimitive.Portal>
    );
}

function AutocompleteList({
    className,
    ...props
}: AutocompletePrimitive.List.Props) {
    return (
        <AutocompletePrimitive.List
            data-slot="autocomplete-list"
            className={cn('outline-none', className)}
            {...props}
        />
    );
}

function AutocompleteItem({
    className,
    ...props
}: AutocompletePrimitive.Item.Props) {
    return (
        <AutocompletePrimitive.Item
            data-slot="autocomplete-item"
            className={cn(
                "flex cursor-default select-none items-center gap-2 rounded-md p-2 text-sm outline-hidden data-highlighted:bg-muted data-highlighted:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className,
            )}
            {...props}
        />
    );
}

function AutocompleteLabel({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="autocomplete-label"
            className={cn(
                'p-2 font-medium text-muted-foreground text-xs',
                className,
            )}
            {...props}
        />
    );
}

export {
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
};
