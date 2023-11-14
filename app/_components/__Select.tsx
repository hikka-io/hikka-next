'use client';

import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';
import {
    Option as BaseOption,
    OptionOwnerState,
    OptionProps,
    Select as BaseSelect,
    SelectOption,
    SelectProps,
} from '@mui/base';
import AiCheckOutlined from './icons/AiCheckOutlined';
import clsx from 'clsx';

interface Props extends SelectProps<number | string, any> {
    children: ReactNode;
}

const getOptionColorClasses = ({
    selected,
    highlighted,
    disabled,
}: Partial<OptionOwnerState<number | string>>) => {
    let classes = '';
    if (disabled) {
        classes += 'text-slate-700';
    } else {
        if (selected) {
            classes += ' bg-secondary/60 hover:bg-secondary';
        } else if (highlighted) {
            classes += ' bg-secondary/30 hover:bg-secondary';
        } else {
            classes += ' hover:bg-secondary/90';
        }
    }
    return classes;
};

const Option = React.forwardRef<HTMLLIElement, OptionProps<number | string>>(
    ({ children, ...props }, ref) => {
        return (
            <BaseOption
                ref={ref}
                {...props}
                slotProps={{
                    root: ({ selected, highlighted, disabled }) => ({
                        className: `list-none p-2 flex gap-2 items-center cursor-default last-of-type:border-b-0 ${getOptionColorClasses(
                            { selected, highlighted, disabled },
                        )}`,
                    }),
                }}
            >
                <AiCheckOutlined className="opacity-0 selected" />
                {children}
            </BaseOption>
        );
    },
);

function renderOwnValue(
    option:
        | SelectOption<number | string>
        | SelectOption<number | string>[]
        | null,
    placeholder?: string,
) {
    const returnElement = (content: ReactNode) => {
        return content;
    };

    if (option == null) {
        return returnElement(
            <span className="opacity-60">
                {placeholder || `Select an option...`}
            </span>,
        );
    }

    if (Array.isArray(option)) {
        if (option.length === 0) {
            return returnElement(
                <span className="opacity-60">
                    {placeholder || `Select an option...`}
                </span>,
            );
        }

        return returnElement(
            <div className="w-full h-full items-center inline-flex gap-2 flex-wrap">
                {option.map((op) => (
                    <span className="btn btn-xs rounded-full btn-secondary" key={op.value}>
                        {op.label}
                    </span>
                ))}
            </div>,
        );
    }

    return option.label;
}

const __Select = ({
    children,
    placeholder,
    multiple,
    className,
    renderValue,
    ...props
}: Props) => {
    const [open, setOpen] = useState(false);
    const baseRef = React.useRef<HTMLButtonElement>(null);
    const elementRef = React.useRef<HTMLUListElement>(null);

    const close = () => {
        setOpen(false);
    };

    const handleOffClick = (event: any) => {
        if (elementRef.current && baseRef.current && open) {
            if (
                elementRef.current!.contains(event.target) ||
                baseRef.current!.contains(event.target)
            ) {
                return;
            }

            close();
        }
    };

    useEffect(() => {
        if (open) {
            document.addEventListener('click', handleOffClick, false);
            document.addEventListener('touchstart', handleOffClick, false);
        }

        return () => {
            document.removeEventListener('click', handleOffClick, false);
            document.removeEventListener('touchstart', handleOffClick, false);
        };
    }, [open]);

    return (
        <BaseSelect
            ref={baseRef}
            slotProps={{
                root: () => ({
                    className: clsx(
                        `btn btn-ghost justify-start h-auto py-2 pr-10 overflow-hidden relative after:right-4 after:absolute`,
                        open
                            ? 'after:content-["▴"]'
                            : 'after:content-["▾"]',
                        className,
                    ),
                    onClick: () => setOpen((prev) => !prev),
                }),
                listbox: {
                    ref: elementRef,
                    style: { minWidth: baseRef.current?.clientWidth },
                    className: `rounded-lg overflow-auto outline-0 bg-black/50 backdrop-blur max-h-96`,
                    onClick: () => !multiple && close(),
                },
                popper: { className: `z-[100]`, open },
            }}
            renderValue={renderValue ? renderValue : (option) => renderOwnValue(option, placeholder)}
            multiple={multiple}
            {...props}
        >
            <div className="rounded-lg overflow-hidden w-full">{children}</div>
        </BaseSelect>
    );
};

__Select.Option = Option;

export default __Select;
