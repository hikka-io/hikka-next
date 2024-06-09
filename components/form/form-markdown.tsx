import { forwardRef } from 'react';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { cn } from '@/utils/utils';

import PlateEditor, {
    EditorProps,
} from '../markdown/plate-editor/plate-editor';

interface Props extends Omit<EditorProps, 'markdown'> {
    name: string;
    label?: string;
    description?: string;
}

const FormMarkdown = forwardRef<EditorProps, Props>(
    ({ name, label, description, className, ...props }, ref) => {
        return (
            <FormField
                name={name}
                render={({ field }) => (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        <FormControl>
                            <PlateEditor
                                {...props}
                                initialValue={field.value || ''}
                                onChange={field.onChange}
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
    },
);

export default FormMarkdown;
