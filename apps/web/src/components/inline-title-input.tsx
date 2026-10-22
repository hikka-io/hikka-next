import type { FC, FocusEventHandler, KeyboardEventHandler } from 'react';

import { cn } from '@/utils/cn';

type Props = {
    value?: string;
    onValueChange: (value: string) => void;
    /** Also the accessible name: the field has no visible label. */
    placeholder: string;
    maxLength: number;
    onFocus?: FocusEventHandler<HTMLTextAreaElement>;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
    className?: string;
};

/** A page title typed in place: it wraps like a heading but never takes a line break. */
const InlineTitleInput: FC<Props> = ({
    value,
    onValueChange,
    placeholder,
    maxLength,
    onFocus,
    onKeyDown,
    className,
}) => (
    <textarea
        aria-label={placeholder}
        placeholder={placeholder}
        rows={1}
        maxLength={maxLength}
        value={value ?? ''}
        onChange={(e) => onValueChange(e.target.value.replace(/\n/g, ' '))}
        onFocus={onFocus}
        onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
            onKeyDown?.(e);
        }}
        className={cn(
            'field-sizing-content w-full resize-none overflow-hidden bg-transparent font-bold text-2xl leading-8 outline-none placeholder:text-muted-foreground/60',
            className,
        )}
    />
);

export default InlineTitleInput;
