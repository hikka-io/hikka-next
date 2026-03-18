'use client';

import { FC, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

import { useSettingsStore } from '@/services/stores/settings-store';

import TagsModal from './tags-modal';

interface Props {
    mode: 'edit' | 'view';
}

const EditDescription: FC<Props> = ({ mode }) => {
    const { control, setValue, getValues } = useFormContext();
    const settings = useSettingsStore();
    const [open, setOpen] = useState(false);

    return (
        <>
        <div className="flex w-full flex-col gap-4">
            <Label className="flex justify-between">
                <span>Опис правки</span>
                <span className="text-muted-foreground">Необов’язково</span>
            </Label>
            {mode === 'edit' && (
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-full gap-2">
                        {settings.editTags?.slice(0, 3).map((tag) => (
                            <Button
                                size="badge"
                                variant="outline"
                                key={tag}
                                onClick={() =>
                                    setValue(
                                        'description',
                                        getValues('description') === ''
                                            ? tag
                                            : getValues('description') +
                                                  (tag.split(' ')[0] == '---'
                                                      ? ' '
                                                      : ', ') +
                                                  tag.toLowerCase(),
                                    )
                                }
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
                            onClick={() => setOpen(true)}
                        >
                            Усі теги
                        </Button>
                        <Button
                            size="badge"
                            variant="secondary"
                            onClick={() => setValue('description', '')}
                        >
                            Очистити поле
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
                        className="w-full disabled:cursor-text disabled:opacity-100"
                        disabled={mode === 'view'}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
                    />
                )}
            />
        </div>
        <ResponsiveModal open={open} onOpenChange={setOpen}>
            <ResponsiveModalContent>
                <ResponsiveModalHeader>
                    <ResponsiveModalTitle>Теги редагування</ResponsiveModalTitle>
                </ResponsiveModalHeader>
                <TagsModal
                    setValue={setValue}
                    getValues={getValues}
                    onClose={() => setOpen(false)}
                />
            </ResponsiveModalContent>
        </ResponsiveModal>
        </>
    );
};

export default EditDescription;
