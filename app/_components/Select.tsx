'use client';
import * as React from 'react';
import {
    CSSProperties,
    ForwardedRef,
    forwardRef,
    memo,
    PropsWithChildren,
    ReactNode,
    useEffect,
    useState,
} from 'react';
import clsx from 'clsx';
import {
    SelectProvider,
    SelectValue,
    useSelect,
    UseSelectButtonSlotProps,
} from '@mui/base/useSelect';
import { useOption, useOptionContextStabilizer } from '@mui/base/useOption';
import { SelectOption } from '@mui/base';
import MaterialSymbolsArrowDropDownRounded from '~icons/material-symbols/arrow-drop-down-rounded';
import { ListContext } from '@mui/base/useList';

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
                    'btn justify-start h-auto w-full py-2 pr-10 overflow-hidden relative after:right-4 after:absolute',
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
                    'z-10 absolute w-full h-auto rounded-b-lg overflow-auto outline-0 bg-black border border-secondary max-h-96',
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
            <li
                ref={ref}
                className={clsx(
                    'py-3 px-4 flex gap-2 items-center hover:bg-secondary cursor-pointer transition-colors duration-100',
                    className,
                )}
                {...props}
            >
                {children}
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
            <div className="whitespace-nowrap truncate">{`${value
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
}

function Option(props: OptionProps) {
    const { children, value, className, disabled = false } = props;

    if (typeof window === 'undefined') {
        return <OptionItem>{children}</OptionItem>;
    }

    const { getRootProps, highlighted, selected } = useOption({
        value,
        disabled,
        label: children,
    });
    const { contextValue } = useOptionContextStabilizer(value);

    return (
        <ListContext.Provider value={contextValue}>
            <OptionItem
                {...getRootProps()}
                className={clsx(
                    selected &&
                        'bg-accent hover:!bg-accent/60 text-accent-content',
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
                <Toggle
                    {...getButtonProps()}
                    className={clsx(
                        listboxVisible &&
                            'rounded-t-lg rounded-b-none border-b-0',
                        toggleClassName,
                    )}
                >
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
                            listboxVisible && 'transform -scale-y-100',
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
                <SelectProvider value={contextValue}>{children}</SelectProvider>
            </Listbox>
        </div>
    );
}

Select.Option = memo(Option);

export default Select;
