import { ComponentProps, FC } from 'react';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Slider } from '../ui/slider';

export interface FormSliderProps extends ComponentProps<typeof Slider> {
    name: string;
    label?: string;
    description?: string;
}

const FormSlider: FC<FormSliderProps> = ({
    name,
    label,
    description,
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
                    </div>
                    <FormControl>
                        <Slider
                            value={field.value}
                            onValueChange={field.onChange}
                            {...props}
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormSlider;
