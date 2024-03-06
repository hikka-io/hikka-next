'use client';

import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useModalContext } from '@/services/providers/modal-provider';
import { useSettingsContext } from '@/services/providers/settings-provider';

import TagsModal from './_components/tags-modal';

interface Props {
    mode: 'edit' | 'view';
}

const Component = ({ mode }: Props) => {
    const { control, setValue } = useFormContext();
    const { openModal } = useModalContext();
    const { editTags } = useSettingsContext();

    return (
        <div className="flex flex-col gap-4 w-full">
            <Label className="flex justify-between">
                <span>Опис правки</span>
                <span className="text-muted-foreground">Необов’язково</span>
            </Label>
            {mode === 'edit' && (
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-2 w-full">
                        {editTags?.slice(0, 3).map((tag) => (
                            <Button
                                size="badge"
                                variant="outline"
                                key={tag}
                                onClick={() => setValue('description', tag)}
                            >
                                {tag
                                    .slice(0, 20)
                                    .trim()
                                    .concat(tag.length > 20 ? '...' : '')}
                            </Button>
                        ))}
                        <Button
                            size="badge"
                            variant="secondary"
                            onClick={() =>
                                openModal({
                                    title: 'Теги редагування',
                                    content: <TagsModal setValue={setValue} />,
                                })
                            }
                        >
                            Усі теги
                        </Button>
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
                        disabled={mode === 'view'}
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
