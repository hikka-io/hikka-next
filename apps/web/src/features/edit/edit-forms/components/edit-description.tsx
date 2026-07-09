import { type FC, useState } from 'react';

import { useFormContext } from '@/components/form/form-context';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useSettingsStore } from '@/services/stores/settings-store';

import TagsModal from './tags-modal';

type Props = {
    mode: 'edit' | 'view';
};

const EditDescription: FC<Props> = ({ mode }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useFormContext() as any;
    const settings = useSettingsStore();
    const [open, setOpen] = useState(false);

    const descriptionValue = form.getFieldValue('description') as string;

    if (mode === 'view' && !descriptionValue?.trim()) {
        return null;
    }

    return (
        <Card>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <h5>Опис правки</h5>
                    <span className="font-normal text-muted-foreground text-sm">
                        Необов'язково
                    </span>
                </div>
                {mode === 'edit' && (
                    <span className="text-muted-foreground text-sm">
                        Оберіть швидкі теги або опишіть, що саме ви змінили — це
                        пришвидшить перевірку
                    </span>
                )}
            </div>

            {mode === 'edit' && (
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-full gap-2">
                        {settings.editTags?.slice(0, 3).map((tag) => (
                            <Button
                                size="badge"
                                variant="outline"
                                key={tag}
                                onClick={() => {
                                    const current = form.getFieldValue(
                                        'description',
                                    ) as string;
                                    form.setFieldValue(
                                        'description',
                                        current === ''
                                            ? tag
                                            : current +
                                                  (tag.split(' ')[0] === '---'
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
        </Card>
    );
};

export default EditDescription;
