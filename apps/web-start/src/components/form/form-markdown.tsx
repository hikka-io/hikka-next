import { FC } from 'react';

import {
    CommentPlateEditor,
    CommentPlateEditorProps,
} from '@/components/plate/editor/plate-editor';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { cn } from '@/utils/cn';

interface Props extends CommentPlateEditorProps {
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
                        <CommentPlateEditor
                            {...props}
                            value={field.value || ''}
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
