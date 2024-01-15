'use client';

import clsx from 'clsx';
import * as React from 'react';
import {
    CSSProperties,
    Children,
    ForwardedRef,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    cloneElement,
    forwardRef,
    memo,
    useEffect,
    useState,
} from 'react';
import MaterialSymbolsArrowDropDownRounded from '~icons/material-symbols/arrow-drop-down-rounded';

import { SelectOption } from '@mui/base';
import { ListContext } from '@mui/base/useList';
import { useOption, useOptionContextStabilizer } from '@mui/base/useOption';
import {
    SelectProvider,
    SelectValue,
    UseSelectButtonSlotProps,
    useSelect,
} from '@mui/base/useSelect';

type OptionValue = string | number | null;

interface GeneralProps extends PropsWithChildren {
    className?: string;
    style?: CSSProperties;
}

const Toggle = forwardRef(
    (
        { children, className, ...props }: GeneralProps,
        ref: ForwardedRef<HTMLButtonElement>,
    ) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    'btn relative h-auto w-full justify-start overflow-hidden py-2 pr-10 after:absolute after:right-4',
                    className,
                )}
                {...props}
            >
                {children}
            </button>
        );
    },
);

const Listbox = forwardRef(
    (
        { children, className, ...props }: GeneralProps,
        ref: ForwardedRef<HTMLUListElement>,
    ) => {
        return (
            <ul
                ref={ref}
                className={clsx(
                    'menu absolute z-10 mt-2 h-auto max-h-96 w-full flex-nowrap overflow-y-scroll rounded-lg border border-secondary bg-base-100 p-2 outline-0 [&_li>*]:py-3',
                    className,
                )}
                {...props}
            >
                {children}
            </ul>
        );
    },
);

const OptionItem = forwardRef(
    (
        { children, className, ...props }: GeneralProps,
        ref: ForwardedRef<HTMLLIElement>,
    ) => {
        return (
            <li ref={ref} {...props}>
                <a className={clsx('', className)}>{children}</a>
            </li>
        );
    },
);

function renderSelectedValue(
    value: SelectValue<SelectOption<OptionValue>, boolean>,
) {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return null;
        }

        return (
            <div className="truncate whitespace-nowrap max-w-[13rem]">{`${value
                .map((so) => so.label)
                .join(' - ')}`}</div>
        );
    }

    return value ? `${value.label}` : null;
}

interface OptionProps extends PropsWithChildren {
    className?: string;
    value: SelectValue<OptionValue, boolean>;
    disabled?: boolean;
    prev: ReactElement;
    next: ReactElement;
}

function Option(props: OptionProps) {
    const { prev, next, children, value, className, disabled = false } = props;

    if (typeof window === 'undefined') {
        return <OptionItem>{children}</OptionItem>;
    }

    const { getRootProps, highlighted, selected, index } = useOption({
        value,
        disabled,
        label: children,
    });

    const { selected: selectedPrev } = useOption({
        label: prev && prev.props.children,
        value: prev && prev.props.value,
        disabled: false
    });

    const { selected: selectedNext } = useOption({
        label: next && next.props.children,
        value: next && next.props.value,
        disabled: false
    });

    const { contextValue } = useOptionContextStabilizer(value);

    return (
        <ListContext.Provider value={contextValue}>
            <OptionItem
                {...getRootProps()}
                className={clsx(
                    selected && 'active',
                    selectedPrev && selectedNext && '!rounded-none',
                    !selectedPrev && selectedNext && '!rounded-b-none',
                    selectedPrev && !selectedNext && '!rounded-t-none',
                    className,
                )}
            >
                {children}
            </OptionItem>
        </ListContext.Provider>
    );
}

interface SelectProps extends PropsWithChildren {
    defaultValue?:
        | SelectValue<OptionValue, boolean>
        | SelectValue<OptionValue, boolean>[];
    value?:
        | SelectValue<OptionValue, boolean>
        | SelectValue<OptionValue, boolean>[];
    placeholder?: string;
    multiple?: boolean;
    className?: string;
    toggleClassName?: string;
    renderToggle?: (
        getButtonProps: (otherHandlers?: {}) => UseSelectButtonSlotProps<{}>,
        listboxVisible: boolean,
        value:
            | SelectValue<OptionValue, boolean>
            | SelectValue<OptionValue, boolean>[],
        toggleClassName?: string,
        placeholder?: string,
    ) => ReactNode;
    renderValue?: (
        value: SelectValue<SelectOption<OptionValue>, boolean>,
    ) => ReactNode;
    onChange?: (
        event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value:
            | SelectValue<OptionValue, boolean>
            | SelectValue<OptionValue, boolean>[],
    ) => void;
}

function Select({
    value: valueProp,
    defaultValue: defaultValueProp,
    placeholder,
    multiple,
    renderToggle,
    renderValue,
    children,
    className,
    toggleClassName,
    onChange,
}: SelectProps) {
    const arrayChildren = Children.toArray(children);
    const listboxRef = React.useRef<HTMLUListElement>(null);
    const [listboxVisible, setListboxVisible] = useState(false);

    const {
        getButtonProps,
        getListboxProps,
        contextValue,
        getOptionMetadata,
        value,
    } = useSelect<SelectValue<OptionValue, boolean>, boolean>({
        value: valueProp,
        defaultValue: defaultValueProp,
        multiple,
        listboxRef,
        onOpenChange: setListboxVisible,
        open: listboxVisible,
        onChange,
    });

    let selectedOptionsMetadata: SelectValue<
        SelectOption<OptionValue>,
        boolean
    >;
    if (multiple) {
        selectedOptionsMetadata = (value as OptionValue[])
            .map((v) => getOptionMetadata(v))
            .filter((o) => o !== undefined) as SelectValue<
            SelectOption<OptionValue>,
            boolean
        >;
    } else {
        selectedOptionsMetadata = (getOptionMetadata(value as OptionValue) ??
            null) as SelectValue<SelectOption<OptionValue>, boolean>;
    }

    useEffect(() => {
        if (listboxVisible) {
            listboxRef.current?.focus();
        }
    }, [listboxVisible]);

    return (
        <div className={clsx('relative', className)}>
            {renderToggle ? (
                renderToggle(
                    getButtonProps,
                    listboxVisible,
                    value,
                    toggleClassName,
                    placeholder,
                )
            ) : (
                <Toggle {...getButtonProps()} className={clsx(toggleClassName)}>
                    {renderValue
                        ? renderValue(selectedOptionsMetadata)
                        : renderSelectedValue(selectedOptionsMetadata) || (
                              <div className="placeholder">
                                  {placeholder ?? ' '}
                              </div>
                          )}
                    <div
                        className={clsx(
                            'absolute right-2 text-2xl',
                            listboxVisible && '-scale-y-100 transform',
                        )}
                    >
                        <MaterialSymbolsArrowDropDownRounded />
                    </div>
                </Toggle>
            )}
            <Listbox
                {...getListboxProps()}
                aria-hidden={!listboxVisible}
                className={listboxVisible ? '' : 'hidden'}
            >
                <SelectProvider value={contextValue}>
                    {Children.map(
                        arrayChildren as ReactElement[],
                        (child: ReactElement, index) => {
                            return cloneElement(child, {
                                prev:
                                    index > 0
                                        ? arrayChildren[index - 1]
                                        : undefined,
                                next:
                                    arrayChildren.length > index + 1
                                        ? arrayChildren[index + 1]
                                        : undefined,
                            });
                        },
                    )}
                </SelectProvider>
            </Listbox>
        </div>
    );
}

Select.Option = memo(Option);

export default Select;