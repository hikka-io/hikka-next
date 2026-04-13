'use client';

import * as React from 'react';
import { FC } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsCheckSmallRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckSmallRounded';
import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useSettingsStore } from '@/services/stores/settings-store';

interface Props {
    setFieldValue: (name: string, value: string) => void;
    getFieldValue: (name: string) => string;
    onClose?: () => void;
}

const TagsModal: FC<Props> = ({ setFieldValue, getFieldValue, onClose }) => {
    const [newTag, setNewTag] = React.useState('');
    const settings = useSettingsStore();

    const handleAddTag = () => {
        settings.setEditTags([...settings.editTags, newTag]);
        setNewTag('');
    };

    const handleSetTag = (tag: string) => {
        const current = getFieldValue('description');
        setFieldValue(
            'description',
            current === ''
                ? tag
                : current +
                      (tag.split(' ')[0] == '---' ? ' ' : ', ') +
                      tag.toLowerCase(),
        );
        onClose?.();
    };

    const handleRemoveTag = (tag: string) => {
        settings.setEditTags(settings.editTags.filter((t) => t !== tag));
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="w-full flex-1"
                    />
                    <Button
                        disabled={!newTag || newTag.trim().length === 0}
                        variant="secondary"
                        size="icon"
                        onClick={handleAddTag}
                    >
                        <MaterialSymbolsAddRounded />
                    </Button>
                </div>
            </div>

            <hr className="bg-border -mx-6 h-px w-auto" />

            <div className="-mx-6 h-full w-auto flex-1 overflow-y-scroll">
                {settings.editTags?.map((tag, index) => (
                    <div
                        key={tag + index}
                        className="flex items-center justify-between gap-2 px-6 py-2"
                    >
                        <p className="line-clamp-2 text-sm">{tag}</p>
                        <div className="flex items-center gap-2">
                            <Button
                                size="icon-md"
                                variant="outline"
                                onClick={() => handleRemoveTag(tag)}
                            >
                                <MaterialSymbolsDeleteForeverRounded className="text-lg" />
                            </Button>
                            <Button
                                size="icon-md"
                                variant="outline"
                                onClick={() => handleSetTag(tag)}
                            >
                                <MaterialSymbolsCheckSmallRounded className="text-lg" />
                            </Button>
                        </div>
                    </div>
                ))}

                {settings.editTags?.length === 0 && (
                    <div className="px-6">
                        <p className="text-muted-foreground text-center text-sm">
                            Не знайдено збережених тегів редагування
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default TagsModal;
