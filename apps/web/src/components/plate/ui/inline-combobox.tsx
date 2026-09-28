import * as React from 'react';

import {
    Combobox,
    ComboboxGroup,
    ComboboxGroupLabel,
    ComboboxItem,
    type ComboboxItemProps,
    ComboboxPopover,
    ComboboxProvider,
    Portal,
    useComboboxContext,
    useComboboxStore,
} from '@ariakit/react';
import { filterWords } from '@platejs/combobox';
import {
    type UseComboboxInputResult,
    useComboboxInput,
    useHTMLInputCursorState,
} from '@platejs/combobox/react';
import { cva } from 'class-variance-authority';
import type { Point, TElement } from 'platejs';
import { useComposedRef, useEditorRef } from 'platejs/react';

import { usePortalContainer } from '@/components/ui/portal-container-context';
import { cn } from '@/utils/cn';

type FilterFn = (
    item: {
        value: string;
        group?: string;
        keywords?: string[];
        label?: string;
    },
    search: string,
) => boolean;

interface InlineComboboxContextValue {
    filter: FilterFn | false;
    inputProps: UseComboboxInputResult['props'];
    inputRef: React.RefObject<HTMLInputElement | null>;
    removeInput: UseComboboxInputResult['removeInput'];
    showTrigger: boolean;
    trigger: string;
    setHasEmpty: (hasEmpty: boolean) => void;
}

const InlineComboboxContext = React.createContext<InlineComboboxContextValue>(
    null as unknown as InlineComboboxContextValue,
);

const defaultFilter: FilterFn = (
    { group, keywords = [], label, value },
    search,
) => {
    const uniqueTerms = new Set(
        [value, ...keywords, group, label].filter(Boolean),
    );

    return Array.from(uniqueTerms).some((keyword) =>
        filterWords(keyword!, search),
    );
};

type InlineComboboxProps = {
    children: React.ReactNode;
    element: TElement;
    trigger: string;
    filter?: FilterFn | false;
    hideWhenNoValue?: boolean;
    showTrigger?: boolean;
    value?: string;
    setValue?: (value: string) => void;
};

const InlineCombobox = ({
    children,
    element,
    filter = defaultFilter,
    hideWhenNoValue = false,
    setValue: setValueProp,
    showTrigger = true,
    trigger,
    value: valueProp,
}: InlineComboboxProps) => {
    const editor = useEditorRef();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const cursorState = useHTMLInputCursorState(inputRef);

    const [valueState, setValueState] = React.useState('');
    const hasValueProp = valueProp !== undefined;
    const value = hasValueProp ? valueProp : valueState;

    const setValue = React.useCallback(
        (newValue: string) => {
            setValueProp?.(newValue);

            if (!hasValueProp) {
                setValueState(newValue);
            }
        },
        [setValueProp, hasValueProp],
    );

    /**
     * Track the point just before the input element so we know where to
     * insertText if the combobox closes due to a selection change.
     */
    const insertPoint = React.useRef<Point | null>(null);

    React.useEffect(() => {
        const path = editor.api.findPath(element);

        if (!path) return;

        const point = editor.api.before(path);

        if (!point) return;

        const pointRef = editor.api.pointRef(point);
        insertPoint.current = pointRef.current;

        return () => {
            pointRef.unref();
        };
    }, [editor, element]);

    const { props: inputProps, removeInput } = useComboboxInput({
        cancelInputOnBlur: true,
        cursorState,
        ref: inputRef,
        onCancelInput: (cause) => {
            if (cause !== 'backspace') {
                editor.tf.insertText(trigger + value, {
                    at: insertPoint?.current ?? undefined,
                });
            }
            if (cause === 'arrowLeft' || cause === 'arrowRight') {
                editor.tf.move({
                    distance: 1,
                    reverse: cause === 'arrowLeft',
                });
            }
        },
    });

    const [hasEmpty, setHasEmpty] = React.useState(false);

    const contextValue: InlineComboboxContextValue = React.useMemo(
        () => ({
            filter,
            inputProps,
            inputRef,
            removeInput,
            setHasEmpty,
            showTrigger,
            trigger,
        }),
        [
            trigger,
            showTrigger,
            filter,
            inputRef,
            inputProps,
            removeInput,
            setHasEmpty,
        ],
    );

    const store = useComboboxStore({
        setValue: (newValue) => React.startTransition(() => setValue(newValue)),
    });

    const items = store.useState('items');

    /**
     * If there is no active ID and the list of items changes, select the first
     * item.
     */
    React.useEffect(() => {
        if (!store.getState().activeId) {
            store.setActiveId(store.first());
        }
    }, [items, store]);

    return (
        <span contentEditable={false}>
            <ComboboxProvider
                open={
                    (items.length > 0 || hasEmpty) &&
                    (!hideWhenNoValue || value.length > 0)
                }
                store={store}
            >
                <InlineComboboxContext.Provider value={contextValue}>
                    {children}
                </InlineComboboxContext.Provider>
            </ComboboxProvider>
        </span>
    );
};

const InlineComboboxInput = React.forwardRef<
    HTMLInputElement,
    React.HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, propRef) => {
    const {
        inputProps,
        inputRef: contextRef,
        showTrigger,
        trigger,
    } = React.useContext(InlineComboboxContext);

    const store = useComboboxContext()!;
    const value = store.useState('value');

    const ref = useComposedRef(propRef, contextRef);

    /**
     * To create an auto-resizing input, we render a visually hidden span
     * containing the input value and position the input element on top of it.
     * This works well for all cases except when input exceeds the width of the
     * container.
     */

    return (
        <>
            {showTrigger && trigger}

            <span className="relative min-h-lh">
                <span
                    className="invisible overflow-hidden text-nowrap"
                    aria-hidden="true"
                >
                    {value || '\u200B'}
                </span>

                <Combobox
                    ref={ref}
                    className={cn(
                        'absolute top-0 left-0 size-full bg-transparent outline-hidden',
                        className,
                    )}
                    value={value}
                    autoSelect
                    {...inputProps}
                    {...props}
                />
            </span>
        </>
    );
});

InlineComboboxInput.displayName = 'InlineComboboxInput';

const InlineComboboxContent = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof ComboboxPopover>) => {
    // Portal prevents CSS from leaking into popover. Inside a modal it must
    // land in the modal's own tree, or react-remove-scroll blocks scrolling.
    const portalContainer = usePortalContainer();

    return (
        <Portal portalElement={portalContainer ?? undefined}>
            <ComboboxPopover
                className={cn(
                    'no-scrollbar z-100 max-h-72 w-72 max-w-[calc(100vw-2rem)] scroll-py-1 overflow-y-auto overflow-x-hidden rounded-(--base-radius) border bg-popover p-1 text-popover-foreground shadow-md outline-hidden',
                    className,
                )}
                {...props}
            >
                {children}
            </ComboboxPopover>
        </Portal>
    );
};

const comboboxItemVariants = cva(
    'relative flex select-none items-center gap-2 rounded-(--base-radius) p-2 text-foreground text-sm outline-hidden [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        defaultVariants: {
            interactive: true,
        },
        variants: {
            interactive: {
                false: 'text-muted-foreground',
                true: 'cursor-pointer transition-colors hover:bg-muted hover:text-accent-foreground data-[active-item=true]:bg-muted data-[active-item=true]:text-accent-foreground',
            },
        },
    },
);

const InlineComboboxItem = ({
    className,
    focusEditor = true,
    group,
    keepOpen = false,
    keywords,
    label,
    onClick,
    ...props
}: {
    focusEditor?: boolean;
    group?: string;
    /** For rows that act on the list itself, like loading more results. */
    keepOpen?: boolean;
    keywords?: string[];
    label?: string;
} & ComboboxItemProps &
    Required<Pick<ComboboxItemProps, 'value'>>) => {
    const { value } = props;

    const { filter, removeInput } = React.useContext(InlineComboboxContext);

    const store = useComboboxContext()!;

    // Optimization: Do not subscribe to value if filter is false
    // biome-ignore lint/correctness/useHookAtTopLevel: deliberate ariakit subscription optimization; the store reference is stable.
    const search = filter && store.useState('value');

    const visible = React.useMemo(
        () =>
            !filter ||
            filter({ group, keywords, label, value }, search as string),
        [filter, group, keywords, label, value, search],
    );

    if (!visible) return null;

    return (
        <ComboboxItem
            className={cn(comboboxItemVariants(), className)}
            hideOnClick={!keepOpen}
            // Without this the row's `value` replaces the typed query.
            setValueOnClick={!keepOpen}
            onClick={(event) => {
                if (!keepOpen) removeInput(focusEditor);
                onClick?.(event);
            }}
            {...props}
        />
    );
};

const InlineComboboxEmpty = ({
    children,
    className,
}: React.HTMLAttributes<HTMLDivElement>) => {
    const { setHasEmpty } = React.useContext(InlineComboboxContext);
    const store = useComboboxContext()!;
    const items = store.useState('items');

    React.useEffect(() => {
        setHasEmpty(true);

        return () => {
            setHasEmpty(false);
        };
    }, [setHasEmpty]);

    if (items.length > 0) return null;

    return (
        <div
            className={cn(
                comboboxItemVariants({ interactive: false }),
                className,
            )}
        >
            {children}
        </div>
    );
};

function InlineComboboxGroup({
    className,
    ...props
}: React.ComponentProps<typeof ComboboxGroup>) {
    return (
        <ComboboxGroup
            {...props}
            className={cn(
                'hidden overflow-hidden [&:has([role=option])]:block',
                className,
            )}
        />
    );
}

function InlineComboboxGroupLabel({
    className,
    ...props
}: React.ComponentProps<typeof ComboboxGroupLabel>) {
    return (
        <ComboboxGroupLabel
            {...props}
            className={cn(
                'px-2 py-1.5 font-medium text-muted-foreground text-xs',
                className,
            )}
        />
    );
}

function InlineComboboxSeparator({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            role="presentation"
            className={cn('-mx-1 my-1 h-px bg-border', className)}
            {...props}
        />
    );
}

export {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxGroup,
    InlineComboboxGroupLabel,
    InlineComboboxInput,
    InlineComboboxItem,
    InlineComboboxSeparator,
};
