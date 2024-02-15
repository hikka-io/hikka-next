import * as React from 'react';
import {
    Control,
    UseFormRegister,
    UseFormSetValue,
} from 'react-hook-form/dist/types/form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    setValue?: UseFormSetValue<any>;
    control?: Control<any>;
    register?: UseFormRegister<any>;
    disabled?: boolean;
    value?: string;
    [x: string]: any;
}

const TAGS = ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'];

const Component = ({ setValue, register, value, disabled }: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <Label className="flex justify-between">
                <span>Опис правки</span>
                <span className="text-muted-foreground">Необов’язково</span>
            </Label>
            {setValue && (
                <div className="flex gap-2 w-full overflow-x-scroll">
                    {TAGS.map((tag) => (
                        <Button
                            size="badge"
                            variant="outline"
                            key={tag}
                            onClick={() => setValue('description', tag)}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            )}
            <Textarea
                placeholder="Введіть причину правки"
                rows={3}
                className="w-full"
                value={value}
                disabled={disabled}
                {...(register ? register('description', { value: value }) : {})}
            />
        </div>
    );
};

export default Component;
