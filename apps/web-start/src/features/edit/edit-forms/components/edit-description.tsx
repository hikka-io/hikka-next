'use client';

import { FC, useState } from 'react';

import { useFormContext } from '@/components/form/form-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

import { useSettingsStore } from '@/services/stores/settings-store';

import TagsModal from './tags-modal';

interface Props {
    mode: 'edit' | 'view';
}

const EditDescription: FC<Props> = ({ mode }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useFormContext() as any;
    const settings = useSettingsStore();
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex w-full flex-col gap-4">
                <Label className="flex justify-between">
                    <span>Опис правки</span>
                    <span className="text-muted-foreground">Необов'язково</span>
                </Label>
                {mode === 'edit' && (
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex w-full gap-2">
                            {settings.editTags?.slice(0, 3).map((tag) => (
                                <Button
                                    size="badge"
                                    variant="outline"
                                    key={tag}
                                    onClick={() => {
                                        const current =
                                            form.getFieldValue(
                                                'description',
                                            ) as string;
                                        form.setFieldValue(
                                            'description',
                                            current === ''
                                                ? tag
                                                : current +
                                                      (tag.split(' ')[0] ===
                                                      '---'
                                                          ? ' '
                                                          : ', ') +
                                                      tag.toLowerCase(),
                                        );
                                    }}
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
                                onClick={() =>
                                    form.setFieldValue('description', '', {
                                        touch: true,
                                    })
                                }
                            >
                                Очистити поле
                            </Button>
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                )}
                <form.Field
                    name="description"
                    children={(field: any) => (
                        <Textarea
                            placeholder="Введіть причину правки"
                            rows={3}
                            className="w-full disabled:cursor-text disabled:opacity-100"
                            disabled={mode === 'view'}
                            value={field.state.value as string}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                        />
                    )}
                />
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen}>
                <ResponsiveModalContent title="Теги редагування">
                    <TagsModal
                        setFieldValue={(name, value) =>
                            form.setFieldValue(name, value)
                        }
                        getFieldValue={(name) =>
                            form.getFieldValue(name) as string
                        }
                        onClose={() => setOpen(false)}
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default EditDescription;
