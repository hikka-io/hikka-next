'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import GroupInputs from '@/app/(pages)/collections/new/_components/collection-settings/_components/group-inputs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useAuthContext } from '@/services/providers/auth-provider';
import {
    State as CollectionState,
    useCollectionContext,
} from '@/services/providers/collection-provider';
import useCreateCollection from '@/services/hooks/collections/useCreateCollection';
import useUpdateCollection from '@/services/hooks/collections/useUpdateCollection';

interface Props {
    mode?: 'create' | 'edit';
}

const Component = ({ mode = 'create' }: Props) => {
    const params = useParams();
    const {
        groups,
        title,
        nsfw,
        spoiler,
        private: isPrivate,
        setState: setCollectionState,
        description,
        tags,
        stateToCreate,
    } = useCollectionContext();

    const { secret } = useAuthContext();

    const { mutate: mutateCreateCollection, isPending: isCreatePending } =
        useCreateCollection({
            ...stateToCreate!(),
            secret: String(secret),
        });

    const { mutate: mutateUpdateCollection, isPending: isUpdatePending } =
        useUpdateCollection({
            ...stateToCreate!(),
            secret: String(secret),
            reference: String(params.reference),
        });

    const handleParamChange = (
        param: keyof CollectionState,
        value: string | boolean,
    ) => {
        setCollectionState!((state) => {
            return {
                ...state,
                [param]: value,
            };
        });
    };

    const handleAddNewGroup = () => {
        if (groups.length === 1 && !groups[0].isGroup) {
            setCollectionState!((state) => {
                return {
                    ...state,
                    groups: [
                        {
                            ...state.groups[0],
                            title: '',
                            isGroup: true,
                        },
                    ],
                };
            });
            return;
        }

        setCollectionState!((state) => {
            return {
                ...state,
                groups: [
                    ...state.groups,
                    {
                        id: String(Date.now()),
                        title: '',
                        isGroup: true,
                        items: [],
                    },
                ],
            };
        });
    };

    return (
        <ScrollArea className="flex flex-col items-start gap-8 lg:max-h-[calc(100vh-6rem)]">
            <div className="flex p-4 flex-col gap-6 h-full">
                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">
                        Назва колекції
                    </Label>
                    <Input
                        placeholder="Введіть назву"
                        value={title || ''}
                        onChange={(e) =>
                            handleParamChange('title', e.target.value)
                        }
                    />
                </div>
                <div className="flex justify-between items-center gap-4">
                    <Label htmlFor="nsfw" className="text-muted-foreground">
                        Контент +18
                    </Label>
                    <Switch
                        checked={nsfw}
                        onCheckedChange={() => handleParamChange('nsfw', !nsfw)}
                        id="nsfw"
                    />
                </div>
                <div className="flex justify-between items-center gap-4">
                    <Label htmlFor="spoiler" className="text-muted-foreground">
                        Спойлери
                    </Label>
                    <Switch
                        checked={spoiler}
                        onCheckedChange={() =>
                            handleParamChange('spoiler', !spoiler)
                        }
                        id="spoiler"
                    />
                </div>
                <div className="flex justify-between items-center gap-4">
                    <Label htmlFor="private" className="text-muted-foreground">
                        Приватна колекція
                    </Label>
                    <Switch
                        checked={isPrivate}
                        onCheckedChange={() =>
                            handleParamChange('private', !isPrivate)
                        }
                        id="private"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Label htmlFor="tags" className="text-muted-foreground">
                        Теги
                    </Label>
                    <InputTags
                        id="tags"
                        value={tags}
                        onChange={(tags) =>
                            setCollectionState!((state) => ({
                                ...state,
                                tags: tags as string[],
                            }))
                        }
                    />
                </div>

                {groups.length > 0 && groups.some((group) => group.isGroup) && (
                    <div className="flex flex-col gap-4">
                        <Label className="text-muted-foreground">Групи</Label>
                        <GroupInputs />
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <Button variant="secondary" onClick={handleAddNewGroup}>
                        Додати групу
                    </Button>
                    {mode === 'edit' && (
                        <Button
                            disabled={
                                isUpdatePending ||
                                title.trim().length < 3 ||
                                description.trim().length < 3
                            }
                            variant="default"
                            onClick={() => mutateUpdateCollection()}
                        >
                            {isUpdatePending && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Зберегти
                        </Button>
                    )}
                    {mode === 'create' && (
                        <Button
                            disabled={
                                isCreatePending ||
                                title.trim().length < 3 ||
                                description.trim().length < 3
                            }
                            variant="default"
                            onClick={() => mutateCreateCollection()}
                        >
                            {isCreatePending && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Створити
                        </Button>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};

export default Component;
