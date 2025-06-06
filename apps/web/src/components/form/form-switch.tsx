import { ComponentProps, FC } from 'react';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Switch } from '../ui/switch';

interface Props extends ComponentProps<typeof Switch> {
    name: string;
    label?: string;
    description?: string;
}

const FormSwitch: FC<Props> = ({
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
                    <div className="flex w-full flex-row items-center justify-between gap-2">
                        <div>
                            {label && <FormLabel>{label}</FormLabel>}
                            {description && (
                                <FormDescription>{description}</FormDescription>
                            )}
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                {...props}
                            />
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormSwitch;
