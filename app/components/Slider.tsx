'use client';

import * as React from 'react';
import { Slider, SliderProps } from '@mui/base';
import clsx from 'clsx';

interface Props extends SliderProps {
}

const resolveSlotProps = (fn: any, args: any) =>
    typeof fn === 'function' ? fn(args) : fn;

const Component = React.forwardRef<HTMLSpanElement, Props>((props, ref) => {
    return (
        <Slider
            ref={ref}
            {...props}
            slotProps={{
                ...props.slotProps,
                root: (ownerState) => {
                    const resolvedSlotProps = resolveSlotProps(
                        props.slotProps?.root,
                        ownerState,
                    );
                    return {
                        ...resolvedSlotProps,
                        className: clsx(
                            `h-1.5 w-full py-4 inline-block relative touch-none ${
                                ownerState.disabled
                                    ? 'opacity-50 cursor-default pointer-events-none text-slate-300 dark:text-slate-600'
                                    : 'hover:opacity-100 cursor-pointer text-purple-500 dark:text-purple-400'
                            }`,
                            resolvedSlotProps?.className,
                        ),
                    };
                },
                rail: (ownerState) => {
                    const resolvedSlotProps = resolveSlotProps(
                        props.slotProps?.rail,
                        ownerState,
                    );
                    return {
                        ...resolvedSlotProps,
                        className: clsx(
                            'block absolute w-full h-1 rounded-sm bg-current opacity-40',
                            resolvedSlotProps?.className,
                        ),
                    };
                },
                track: (ownerState) => {
                    const resolvedSlotProps = resolveSlotProps(
                        props.slotProps?.track,
                        ownerState,
                    );

                    return {
                        ...resolvedSlotProps,
                        className: clsx(
                            'block absolute h-1 rounded-sm bg-current',
                            resolvedSlotProps?.className,
                        ),
                    };
                },
                thumb: (ownerState, { active, focused }) => {
                    const resolvedSlotProps = resolveSlotProps(
                        props.slotProps?.thumb,
                        ownerState,
                    );
                    return {
                        ...resolvedSlotProps,
                        className: clsx(
                            `absolute w-4 h-4 -ml-1.5 -mt-1.5 box-border rounded-full outline-0 border-3 border-solid border-current bg-white hover:shadow-outline-purple`,
                            focused || active && 'shadow-outline-purple',
                            resolvedSlotProps?.className,
                        ),
                    };
                },
            }}
        />
    );
});

export default Component;
