import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';
import React, { forwardRef } from 'react';

import MDEditor from '@/components/markdown/editor/MD-editor';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { cn } from '@/utils/utils';

interface Props extends Omit<MDXEditorProps, 'markdown'> {
    name: string;
    label?: string;
    description?: string;
}

const FormMarkdown = forwardRef<MDXEditorMethods, Props>(
    ({ name, label, description, className, ...props }, ref) => {
        return (
            <FormField
                name={name}
                render={({ field }) => (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        <FormControl>
                            <MDEditor
                                {...props}
                                markdown={field.value || ''}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                className={cn(
                                    'text-muted-foreground',
                                    className,
                                )}
                                ref={ref}
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
