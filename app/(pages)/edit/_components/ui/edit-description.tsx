import * as React from 'react';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form/dist/types/form';



import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';


interface Props {
    setValue?: UseFormSetValue<any>;
    control: Control<any>;
    disabled?: boolean;
}

const TAGS = ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'];

const Component = ({ setValue, control, disabled }: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <Label className="flex justify-between">
                <span>Опис правки</span>
                <span className="text-muted-foreground">Необов’язково</span>
            </Label>
            {setValue && (
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-2 w-full">
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
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            )}
            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, ref, value } }) => (
                    <Textarea
                        placeholder="Введіть причину правки"
                        rows={3}
                        className="w-full disabled:opacity-100 disabled:cursor-text"
                        disabled={disabled}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
                    />
                )}
            />

        </div>
    );
};

export default Component;
