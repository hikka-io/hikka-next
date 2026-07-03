import type { FC } from 'react';

import { useStore } from '@tanstack/react-form';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { FIELD_BASE } from '@/components/ui/field-base';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';

import { useFieldContext } from './form-context';

const utcToLocalDate = (unixTime: number): Date => {
    const d = new Date(unixTime * 1000);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

const localDateToUtcUnix = (date: Date): number => {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000;
};

export type Props = {
    label?: string;
    description?: string;
    minDate?: number;
    className?: string;
    children?: React.ReactNode;
};

export const DatePickerField: FC<Props> = ({
    label,
    description,
    children,
    className,
    minDate,
}) => {
    const field = useFieldContext<number | null>();
    const errors = useStore(field.store, (state) => state.meta.errors);
    const isInvalid = errors.length > 0;

    const dateValue = field.state.value
        ? utcToLocalDate(field.state.value)
        : undefined;

    return (
        <Field data-invalid={isInvalid} className={className}>
            <div className="flex flex-nowrap items-center justify-between">
                {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
                {children}
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        id={field.name}
                        className={cn(
                            FIELD_BASE,
                            'flex h-10 cursor-pointer items-center justify-start px-3 py-2 text-left font-normal',
                            !field.state.value && 'text-muted-foreground',
                        )}
                    >
                        {dateValue ? (
                            format(dateValue, 'PPP', {
                                locale: uk,
                            })
                        ) : (
                            <span>Виберіть дату</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        locale={uk}
                        mode="single"
                        selected={dateValue}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            field.handleChange(
                                date ? localDateToUtcUnix(date) : null,
                            );
                        }}
                        disabled={(date) =>
                            date > new Date() ||
                            date < new Date('1900-01-01') ||
                            (minDate ? date < utcToLocalDate(minDate) : false)
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError errors={errors} />
        </Field>
    );
};

export default DatePickerField;
