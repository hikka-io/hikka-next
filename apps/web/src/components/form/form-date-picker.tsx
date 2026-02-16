import { format, fromUnixTime } from 'date-fns';
import { getUnixTime } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ComponentProps, FC } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/utils/cn';

interface Props extends ComponentProps<'textarea'> {
    name: string;
    label?: string;
    description?: string;
    minDate?: number;
}

const FormDatePicker: FC<Props> = ({
    name,
    label,
    description,
    children,
    className,
    minDate,
    ...props
}) => {
    return (
        <FormField
            name={name}
            render={({ field }) => {
                const dateValue = field.value
                    ? fromUnixTime(field.value)
                    : undefined;

                return (
                    <FormItem className={className}>
                        <div className="flex flex-nowrap items-center justify-between">
                            {label && <FormLabel>{label}</FormLabel>}
                            {children}
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value &&
                                                'text-muted-foreground',
                                        )}
                                    >
                                        {dateValue ? (
                                            format(dateValue, 'PPP')
                                        ) : (
                                            <span>Виберіть дату</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={dateValue}
                                    onSelect={(date) => {
                                        field.onChange(
                                            date
                                                ? getUnixTime(date)
                                                : undefined,
                                        );
                                    }}
                                    disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date('1900-01-01') ||
                                        (minDate
                                            ? date < fromUnixTime(minDate)
                                            : false)
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        {description && (
                            <FormDescription>{description}</FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};

export default FormDatePicker;
