import { FC } from 'react';

import { cn } from '@/utils/utils';
import BasePlateEditor, {
    PlateEditorProps,
} from '../markdown/editor/basic-editor';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';

interface Props extends PlateEditorProps {
    name: string;
    label?: string;
    description?: string;
    className?: string;
}

const FormMarkdown: FC<Props> = ({
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
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <BasePlateEditor
                            {...props}
                            initialValue={field.value || ''}
                            onValueChange={field.onChange}
                            className={cn(className)}
                        />
                    </FormControl>
                    <div className="space-y-2 px-3">
                        {description && (
                            <FormDescription>{description}</FormDescription>
                        )}
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    );
};

export default FormMarkdown;
