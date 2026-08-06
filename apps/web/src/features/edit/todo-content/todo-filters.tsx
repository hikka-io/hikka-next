import { type FC, useEffect, useState } from 'react';

import {
    AlignLeft,
    Hash,
    Layers,
    Link2,
    Play,
    Type,
    UserRound,
} from 'lucide-react';

import { ContentTypeEnum } from '@hikka/api';

import { BadgeFilter } from '@/components/ui/badge-filter';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ClearFiltersFooter from '@/features/filters/clear-filters-footer';
import useDebounce from '@/services/hooks/use-debounce';
import { cn } from '@/utils/cn';
import {
    ANIME_MEDIA_TYPE,
    MANGA_MEDIA_TYPE,
    NOVEL_MEDIA_TYPE,
} from '@/utils/constants/common';

export type TodoFiltersValue = {
    title_ua?: boolean;
    title_en?: boolean;
    title_original?: boolean;
    synopsis_ua?: boolean;
    synopsis_en?: boolean;
    media_type?: string;
    mal_id?: number;
    name_ua?: boolean;
    name_en?: boolean;
    name_original?: boolean;
    description_ua?: boolean;
    content_type?: 'anime' | 'manga' | 'novel';
    content_slug?: string;
};

const TITLE_PROPERTIES: Hikka.FilterProperty<string> = {
    title_ua: { title_ua: 'Українською', title_en: 'Ukrainian' },
    title_en: { title_ua: 'Англійською', title_en: 'English' },
    title_original: { title_ua: 'Оригінальна', title_en: 'Original' },
};

const SYNOPSIS_PROPERTIES: Hikka.FilterProperty<string> = {
    synopsis_ua: { title_ua: 'Українською', title_en: 'Ukrainian' },
    synopsis_en: { title_ua: 'Англійською', title_en: 'English' },
};

const NAME_PROPERTIES: Hikka.FilterProperty<string> = {
    name_ua: { title_ua: 'Українською', title_en: 'Ukrainian' },
    name_en: { title_ua: 'Англійською', title_en: 'English' },
    name_original: { title_ua: 'Оригінальне', title_en: 'Original' },
};

const DESCRIPTION_PROPERTIES: Hikka.FilterProperty<string> = {
    description_ua: { title_ua: 'Українською', title_en: 'Ukrainian' },
};

const CONTENT_TYPE_PROPERTIES: Hikka.FilterProperty<string> = {
    anime: { title_ua: 'Аніме', title_en: 'Anime' },
    manga: { title_ua: 'Манґа', title_en: 'Manga' },
    novel: { title_ua: 'Ранобе', title_en: 'Ranobe' },
};

const getMediaType = (
    contentType: ContentTypeEnum,
): Hikka.FilterProperty<string> | undefined => {
    switch (contentType) {
        case ContentTypeEnum.ANIME:
            return ANIME_MEDIA_TYPE;
        case ContentTypeEnum.MANGA:
            return MANGA_MEDIA_TYPE;
        case ContentTypeEnum.NOVEL:
            return NOVEL_MEDIA_TYPE;
        default:
            return undefined;
    }
};

const getSelected = (
    properties: Hikka.FilterProperty<string>,
    value: TodoFiltersValue,
) =>
    Object.keys(properties).filter(
        (key) => value[key as keyof TodoFiltersValue],
    );

type BodyProps = {
    className?: string;
    contentType: ContentTypeEnum;
    value: TodoFiltersValue;
    onChange: (value: TodoFiltersValue) => void;
};

/** Filter fields only — no footer/padding; use inside modals or custom wrappers. */
export const TodoFiltersBody: FC<BodyProps> = ({
    className,
    contentType,
    value,
    onChange,
}) => {
    const handleGroupChange = (
        properties: Hikka.FilterProperty<string>,
        selected: string[],
    ) => {
        const updates: TodoFiltersValue = {};
        Object.keys(properties).forEach((key) => {
            // Unselected flags drop out of the URL instead of writing `=false`.
            updates[key as keyof TodoFiltersValue] = (
                selected.includes(key) ? true : undefined
            ) as never;
        });
        onChange({ ...value, ...updates });
    };

    const isMedia =
        contentType === ContentTypeEnum.ANIME ||
        contentType === ContentTypeEnum.MANGA ||
        contentType === ContentTypeEnum.NOVEL;
    const isCharacter = contentType === ContentTypeEnum.CHARACTER;
    const isPerson = contentType === ContentTypeEnum.PERSON;

    const mediaType = getMediaType(contentType);

    const [malIdInput, setMalIdInput] = useState(
        value.mal_id !== undefined ? String(value.mal_id) : '',
    );
    const [debouncedMalId] = useDebounce({ value: malIdInput, delay: 500 });

    useEffect(() => {
        setMalIdInput(value.mal_id !== undefined ? String(value.mal_id) : '');
    }, [value.mal_id, contentType]);

    useEffect(() => {
        const parsed = debouncedMalId ? Number(debouncedMalId) : undefined;
        if (parsed === value.mal_id) return;
        onChange({ ...value, mal_id: parsed });
    }, [debouncedMalId]);

    const [contentSlugInput, setContentSlugInput] = useState(
        value.content_slug ?? '',
    );
    const [debouncedContentSlug] = useDebounce({
        value: contentSlugInput,
        delay: 500,
    });

    useEffect(() => {
        setContentSlugInput(value.content_slug ?? '');
    }, [value.content_slug, contentType]);

    useEffect(() => {
        const parsed = debouncedContentSlug || undefined;
        if (parsed === value.content_slug) return;
        onChange({ ...value, content_slug: parsed });
    }, [debouncedContentSlug]);

    return (
        <div className={cn('flex flex-col gap-8', className)}>
            {isMedia && (
                <>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Type className="size-4 shrink-0" />
                            <Label>Без назви</Label>
                        </div>
                        <BadgeFilter
                            properties={TITLE_PROPERTIES}
                            selected={getSelected(TITLE_PROPERTIES, value)}
                            property="title"
                            onParamChange={(_, selected) =>
                                handleGroupChange(
                                    TITLE_PROPERTIES,
                                    selected as string[],
                                )
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AlignLeft className="size-4 shrink-0" />
                            <Label>Без опису</Label>
                        </div>
                        <BadgeFilter
                            properties={SYNOPSIS_PROPERTIES}
                            selected={getSelected(SYNOPSIS_PROPERTIES, value)}
                            property="synopsis"
                            onParamChange={(_, selected) =>
                                handleGroupChange(
                                    SYNOPSIS_PROPERTIES,
                                    selected as string[],
                                )
                            }
                        />
                    </div>
                    {mediaType && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Play className="size-4 shrink-0" />
                                <Label>Тип</Label>
                            </div>
                            <Select
                                multiple
                                value={
                                    value.media_type ? [value.media_type] : []
                                }
                                onValueChange={(selected) =>
                                    onChange({
                                        ...value,
                                        media_type:
                                            selected[selected.length - 1],
                                    })
                                }
                            >
                                <SelectTrigger size="md">
                                    <SelectValue placeholder="Виберіть тип..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectList>
                                        <SelectGroup>
                                            {Object.keys(mediaType).map(
                                                (item) => (
                                                    <SelectItem
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {
                                                            mediaType[item]
                                                                .title_ua
                                                        }
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
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Hash className="size-4 shrink-0" />
                            <Label htmlFor="mal_id">MAL ID</Label>
                        </div>
                        <Input
                            id="mal_id"
                            inputMode="numeric"
                            placeholder="Введіть MAL ID..."
                            value={malIdInput}
                            onChange={(e) =>
                                setMalIdInput(e.target.value.replace(/\D/g, ''))
                            }
                        />
                    </div>
                </>
            )}

            {(isCharacter || isPerson) && (
                <>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <UserRound className="size-4 shrink-0" />
                            <Label>Без імені</Label>
                        </div>
                        <BadgeFilter
                            properties={NAME_PROPERTIES}
                            selected={getSelected(NAME_PROPERTIES, value)}
                            property="name"
                            onParamChange={(_, selected) =>
                                handleGroupChange(
                                    NAME_PROPERTIES,
                                    selected as string[],
                                )
                            }
                        />
                    </div>
                    {isCharacter && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <AlignLeft className="size-4 shrink-0" />
                                <Label>Без опису</Label>
                            </div>
                            <BadgeFilter
                                properties={DESCRIPTION_PROPERTIES}
                                selected={getSelected(
                                    DESCRIPTION_PROPERTIES,
                                    value,
                                )}
                                property="description"
                                onParamChange={(_, selected) =>
                                    handleGroupChange(
                                        DESCRIPTION_PROPERTIES,
                                        selected as string[],
                                    )
                                }
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Layers className="size-4 shrink-0" />
                            <Label>Тип контенту</Label>
                        </div>
                        <Select
                            multiple
                            value={
                                value.content_type ? [value.content_type] : []
                            }
                            onValueChange={(selected) =>
                                onChange({
                                    ...value,
                                    content_type: selected[
                                        selected.length - 1
                                    ] as TodoFiltersValue['content_type'],
                                })
                            }
                        >
                            <SelectTrigger size="md">
                                <SelectValue placeholder="Виберіть тип контенту..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectList>
                                    <SelectGroup>
                                        {Object.keys(
                                            CONTENT_TYPE_PROPERTIES,
                                        ).map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {
                                                    CONTENT_TYPE_PROPERTIES[
                                                        item
                                                    ].title_ua
                                                }
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectList>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Link2 className="size-4 shrink-0" />
                            <Label htmlFor="content_slug">Slug контенту</Label>
                        </div>
                        <Input
                            id="content_slug"
                            placeholder="Введіть slug контенту..."
                            value={contentSlugInput}
                            onChange={(e) =>
                                setContentSlugInput(e.target.value)
                            }
                        />
                    </div>
                </>
            )}
        </div>
    );
};

type Props = BodyProps;

/** Side-panel composition: scrollable filter body + sticky footer. */
export function TodoFilters({
    className,
    contentType,
    value,
    onChange,
}: Props) {
    return (
        <div className={cn('flex w-full flex-col', className)}>
            <TodoFiltersBody
                className="flex-1 overflow-y-auto p-4 py-8"
                contentType={contentType}
                value={value}
                onChange={onChange}
            />
            <ClearFiltersFooter
                className="shrink-0 border-t p-4"
                preserve={['tab']}
            />
        </div>
    );
}
