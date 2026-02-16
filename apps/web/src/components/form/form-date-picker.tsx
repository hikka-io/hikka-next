import { format } from 'date-fns';
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
}

const FormDatePicker: FC<Props> = ({
    name,
    label,
    description,
    children,
    className,
    ...props
}) => {
    return (
        <FormField
            name={name}
            render={({ field }) => (
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
                                        !field.value && 'text-muted-foreground',
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, 'PPP')
                                    ) : (
                                        <span>Виберіть дату</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date('1900-01-01')
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
            )}
        />
    );
};

export default FormDatePicker;
