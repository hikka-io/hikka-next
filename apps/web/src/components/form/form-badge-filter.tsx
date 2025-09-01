import { FC } from 'react';

import { BadgeFilter, BadgeFilterProps } from "@/features/filters";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';

export interface FormBadgeFilterProps
    extends Omit<BadgeFilterProps, 'onParamChange' | 'selected'> {
    name: string;
    label?: string;
    description?: string;
    className?: string;
}

const FormBadgeFilter: FC<FormBadgeFilterProps> = ({
    name,
    label,
    description,
    className,
    properties,
    property,
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
                        <BadgeFilter
                            properties={properties}
                            selected={field.value ?? []}
                            property={property}
                            onParamChange={(key, value) => {
                                field.onChange(value);
                            }}
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

export default FormBadgeFilter;
