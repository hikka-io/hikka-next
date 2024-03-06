'use client';

import * as React from 'react';
import { UseFormSetValue } from 'react-hook-form/dist/types/form';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import MaterialSymbolsCheckSmallRounded from '~icons/material-symbols/check-small-rounded';
import MaterialSymbolsDeleteForeverRounded from '~icons/material-symbols/delete-forever-rounded';



import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModalContext } from '@/services/providers/modal-provider';
import { useSettingsContext } from '@/services/providers/settings-provider';
import P from '@/components/typography/p';


interface Props {
    setValue: UseFormSetValue<any>;
}

const Component = ({ setValue }: Props) => {
    const { closeModal } = useModalContext();
    const [newTag, setNewTag] = React.useState('');
    const { setState: setSettingsState, editTags } = useSettingsContext();

    const handleAddTag = () => {
        setSettingsState!((prev) => ({
            ...prev,
            editTags: [...(prev?.editTags || []), newTag],
        }));
        setNewTag('');
    };

    const handleSetTag = (tag: string) => {
        setValue('description', tag);
        closeModal();
    };

    const handleRemoveTag = (tag: string) => {
        setSettingsState!((prev) => ({
            ...prev,
            editTags: prev?.editTags?.filter((t) => t !== tag) || [],
        }));
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 w-full"
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

            <hr className="h-[1px] w-auto -mx-6 bg-border" />

            <div className="flex-1 overflow-y-scroll w-auto h-full -mx-6">
                {editTags?.map((tag, index) => (
                    <div
                        key={tag + index}
                        className="flex gap-2 items-center justify-between px-6 py-2"
                    >
                        <P className="text-sm line-clamp-2">{tag}</P>
                        <div className="flex gap-2 items-center">
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

                {editTags?.length === 0 && (
                    <div className="px-6">
                        <P className="text-sm text-muted-foreground text-center">
                            Не знайдено збережених тегів редагування
                        </P>
                    </div>
                )}
            </div>
        </>
    );
};

export default Component;
