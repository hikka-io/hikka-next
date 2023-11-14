import * as React from 'react';
import { Input as BaseInput, InputProps } from '@mui/base';
import clsx from 'clsx';

interface Props {
    mode?: 'dark' | 'light';
}

const Input = (props: InputProps & Props) => {
    return (
        <BaseInput
            slotProps={{
                root: ({ focused }) => ({
                    className: clsx(
                        'flex items-center',
                        'text-sm font-normal',
                        props.mode === 'light'
                            ? ''
                            : 'bg-secondary/30',
                        'transition duration-100',
                        'w-full h-12 leading-5 px-3 py-3 rounded-lg focus-visible:outline-0',
                        focused
                            ? props.mode === 'light'
                                ? ''
                                : 'hover:bg-secondary-focus/60 bg-secondary-focus/60'
                            : props.mode === 'light'
                            ? ''
                            : 'hover:bg-secondary-focus/60',
                    ),
                }),
                input: {
                    className: clsx(
                        'text-base leading-5',
                        'bg-transparent',
                        'w-full focus-visible:outline-0',
                    ),
                },
            }}
            {...props}
        />
    );
};

export default Input;
