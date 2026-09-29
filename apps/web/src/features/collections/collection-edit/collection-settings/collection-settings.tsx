import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { CollectionVisibilityEnum } from '@hikka/api';
import {
    API_LIMITS,
    createCollectionMutation,
    updateCollectionMutation,
} from '@hikka/api';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsRefreshRounded from '@/components/icons/material-symbols/MaterialSymbolsRefreshRounded';
import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import { Button } from '@/components/ui/button';
import { FooterBar } from '@/components/ui/footer-bar';
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
import Spinner from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { invalidateCollections } from '@/utils/api/invalidate-content-state';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { COLLECTION_CONTENT_TYPE_OPTIONS } from '@/utils/labels';
import { Link, useParams, useRouter } from '@/utils/navigation';

import { useCollectionContext } from '../collection-provider';
import GroupInputs from './components/group-inputs';

const COLLECTION_VISIBILITY_OPTIONS = [
    {
        value: 'public',
        label: 'Публічна',
    },
    {
        value: 'private',
        label: 'Приватна',
    },
    {
        value: 'unlisted',
        label: 'Лише у профілі',
    },
] satisfies { value: CollectionVisibilityEnum; label: string }[];

type Props = {
    mode?: 'create' | 'edit';
};

const CollectionEditSettings: FC<Props> = ({ mode = 'create' }) => {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();

    const groups = useCollectionContext((state) => state.groups);
    const title = useCollectionContext((state) => state.title);
    const nsfw = useCollectionContext((state) => state.nsfw);
    const spoiler = useCollectionContext((state) => state.spoiler);
    const visibility = useCollectionContext((state) => state.visibility);
    const content_type = useCollectionContext((state) => state.content_type);
    const description = useCollectionContext((state) => state.description);
    const tags = useCollectionContext((state) => state.tags);
    const getApiData = useCollectionContext((state) => state.getApiData);

    const addGroup = useCollectionContext((state) => state.addGroup);
    const setTitle = useCollectionContext((state) => state.setTitle);
    const setTags = useCollectionContext((state) => state.setTags);
    const setContentType = useCollectionContext(
        (state) => state.setContentType,
    );
    const setVisibility = useCollectionContext((state) => state.setVisibility);
    const setNsfw = useCollectionContext((state) => state.setNsfw);
    const setSpoiler = useCollectionContext((state) => state.setSpoiler);

    const {
        mutate: mutateCreateCollection,
        isPending: isCreatePending,
        isSuccess,
    } = useMutation({
        ...createCollectionMutation(),
        onSuccess: (data) => {
            invalidateCollections(queryClient);
            toast.success('Ви успішно створили колекцію.');

            router.push(
                `${CONTENT_TYPE_LINKS.collection}/${data.reference}/update`,
            );
        },
    });

    const { mutate: mutateUpdateCollection, isPending: isUpdatePending } =
        useMutation({
            ...updateCollectionMutation(),
            onSuccess: (_data) => {
                invalidateCollections(queryClient);
                toast.success('Ви успішно оновили колекцію.');
            },
        });

    const canSubmit =
        !!title &&
        title.trim().length >= API_LIMITS.collectionTitle.min &&
        !!description &&
        description.trim().length >= API_LIMITS.collectionDescription.min;

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
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">Групи</Label>
                    {groups.length > 0 &&
                        groups.some((group) => group.title !== null) && (
                            <GroupInputs />
                        )}
                    <Button variant="secondary" size="md" onClick={addGroup}>
                        Додати групу
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    <Label htmlFor="tags" className="text-muted-foreground">
                        Теги
                    </Label>
                    <InputTags
                        disabled={tags.length === API_LIMITS.tags.max}
                        id="tags"
                        value={tags}
                        onChange={(tags) => setTags(tags as string[])}
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
                            onValueChange={(value) =>
                                setContentType(
                                    value[0] as Parameters<
                                        typeof setContentType
                                    >[0],
                                )
                            }
                        >
                            <SelectTrigger size="md">
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
                        onValueChange={(value) =>
                            setVisibility(
                                value[0] as Parameters<typeof setVisibility>[0],
                            )
                        }
                    >
                        <SelectTrigger size="md">
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
                        onCheckedChange={() => setNsfw(!nsfw)}
                        id="nsfw"
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="spoiler" className="text-muted-foreground">
                        Спойлери
                    </Label>
                    <Switch
                        checked={spoiler}
                        onCheckedChange={() => setSpoiler(!spoiler)}
                        id="spoiler"
                    />
                </div>
            </div>
            <FooterBar className="flex-row">
                {mode === 'edit' && (
                    <Button
                        size="md"
                        className="flex-1"
                        disabled={isUpdatePending || !canSubmit}
                        variant="default"
                        onClick={() =>
                            mutateUpdateCollection({
                                path: { reference: String(params.reference) },
                                body: getApiData(),
                            })
                        }
                    >
                        {isUpdatePending ? (
                            <Spinner />
                        ) : (
                            <MaterialSymbolsRefreshRounded className="size-4" />
                        )}
                        Оновити
                    </Button>
                )}
                {mode === 'create' && (
                    <Button
                        className="flex-1"
                        disabled={isSuccess || isCreatePending || !canSubmit}
                        size="md"
                        variant="default"
                        onClick={() =>
                            mutateCreateCollection({
                                body: getApiData(),
                            })
                        }
                    >
                        {isCreatePending ? (
                            <Spinner />
                        ) : (
                            <MaterialSymbolsAddRounded />
                        )}
                        Створити
                    </Button>
                )}
                {mode === 'edit' && (
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Button
                                    size="icon-md"
                                    variant="secondary"
                                    render={
                                        <Link
                                            target="_blank"
                                            to={`${CONTENT_TYPE_LINKS.collection}/${params.reference}`}
                                        />
                                    }
                                />
                            }
                        >
                            <MaterialSymbolsVisibilityOutlineRounded className="size-4" />
                        </TooltipTrigger>
                        <TooltipContent>Переглянути</TooltipContent>
                    </Tooltip>
                )}
            </FooterBar>
        </ScrollArea>
    );
};

export default CollectionEditSettings;
