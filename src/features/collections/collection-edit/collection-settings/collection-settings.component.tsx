'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import GroupInputs from '@/features/collections/collection-edit/collection-settings/group-inputs';

import useCreateCollection from '@/services/hooks/collections/use-create-collection';
import useUpdateCollection from '@/services/hooks/collections/use-update-collection';
import {
    State as CollectionState,
    useCollectionContext,
} from '@/services/providers/collection-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import {
    COLLECTION_CONTENT_TYPE_OPTIONS,
    COLLECTION_VISIBILITY_OPTIONS,
} from '@/utils/constants/common';

interface Props {
    mode?: 'create' | 'edit';
}

const CollectionSettings: FC<Props> = ({ mode = 'create' }) => {
    const { openModal } = useModalContext();
    const params = useParams();
    const {
        groups,
        title,
        nsfw,
        spoiler,
        visibility,
        content_type,
        setState: setCollectionState,
        description,
        tags,
        stateToCreate,
    } = useCollectionContext();

    const { mutate: mutateCreateCollection, isPending: isCreatePending } =
        useCreateCollection({
            ...stateToCreate!(),
        });

    const { mutate: mutateUpdateCollection, isPending: isUpdatePending } =
        useUpdateCollection({
            ...stateToCreate!(),
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

    const handleChangeContentType = (value: string[]) =>
        setCollectionState!((state) => ({
            ...state,
            content_type: value[0] as API.ContentType,
        }));

    const handleChangeVisibility = (value: string[]) =>
        setCollectionState!((state) => ({
            ...state,
            visibility: value[0] as 'private' | 'public' | 'unlisted',
        }));

    return (
        <ScrollArea className="flex flex-col items-start gap-8 lg:max-h-[calc(100vh-6rem)]">
            <div className="flex h-full flex-col gap-6 p-4">
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

                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">Групи</Label>
                    {groups.length > 0 &&
                        groups.some((group) => group.isGroup) && (
                            <GroupInputs />
                        )}
                    <Button variant="secondary" onClick={handleAddNewGroup}>
                        Додати групу
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    <Label htmlFor="tags" className="text-muted-foreground">
                        Теги
                    </Label>
                    <InputTags
                        disabled={tags.length === 3}
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

                {mode === 'create' && (
                    <div className="flex flex-col gap-4">
                        <Label
                            htmlFor="private"
                            className="text-muted-foreground"
                        >
                            Тип
                        </Label>
                        <Select
                            disabled={groups.some((g) => g.items.length > 0)}
                            value={[content_type]}
                            onValueChange={handleChangeContentType}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectList>
                                    <SelectGroup>
                                        {COLLECTION_CONTENT_TYPE_OPTIONS.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectList>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <Label htmlFor="private" className="text-muted-foreground">
                        Відображення
                    </Label>

                    <Select
                        value={[visibility]}
                        onValueChange={handleChangeVisibility}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectList>
                                <SelectGroup>
                                    {COLLECTION_VISIBILITY_OPTIONS.map(
                                        (option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="nsfw" className="text-muted-foreground">
                        Контент +18
                    </Label>
                    <Switch
                        checked={nsfw}
                        onCheckedChange={() => handleParamChange('nsfw', !nsfw)}
                        id="nsfw"
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
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

                <div className="flex flex-col gap-4">
                    {mode === 'edit' && (
                        <Button
                            disabled={
                                isUpdatePending ||
                                !title ||
                                title.trim().length < 3 ||
                                !description ||
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
                        <div className="flex gap-2">
                            <Button
                                className="flex-1"
                                disabled={
                                    isCreatePending ||
                                    !title ||
                                    title.trim().length < 3 ||
                                    !description ||
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
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};

export default CollectionSettings;
