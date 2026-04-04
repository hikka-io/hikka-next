'use client';

import {
    ArticleCategoryEnum,
    CollectionContentType,
    CommentsContentType,
    ContentTypeEnum,
    FeedArticleCategory,
    FeedArticleContentType,
    FeedContentType,
} from '@hikka/client';
import { FC, useId, useState } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { Switch } from '@/components/ui/switch';

import { cn } from '@/utils/cn';
import {
    ARTICLE_CATEGORY_OPTIONS,
    COLLECTION_CONTENT_TYPE_OPTIONS,
    CONTENT_TYPES,
} from '@/utils/constants/common';

export interface FeedSubTypeFilters {
    feed_content_types: FeedContentType[] | null;
    comment_content_types: CommentsContentType[] | null;
    article_content_types: FeedArticleContentType[] | null;
    article_categories: FeedArticleCategory[] | null;
    collection_content_types: CollectionContentType[] | null;
}

const COMMENT_OPTIONS: { value: CommentsContentType; label: string }[] = (
    [
        ContentTypeEnum.ANIME,
        ContentTypeEnum.MANGA,
        ContentTypeEnum.NOVEL,
        ContentTypeEnum.CHARACTER,
        ContentTypeEnum.PERSON,
        ContentTypeEnum.COLLECTION,
        ContentTypeEnum.ARTICLE,
        ContentTypeEnum.EDIT,
    ] as CommentsContentType[]
).map((v) => ({ value: v, label: CONTENT_TYPES[v].title_ua }));

const ARTICLE_CONTENT_OPTIONS: {
    value: FeedArticleContentType;
    label: string;
}[] = [
    { value: ContentTypeEnum.ANIME, label: CONTENT_TYPES.anime.title_ua },
    { value: ContentTypeEnum.MANGA, label: CONTENT_TYPES.manga.title_ua },
    { value: ContentTypeEnum.NOVEL, label: CONTENT_TYPES.novel.title_ua },
    { value: 'no_content', label: 'Без контенту' },
];

const FEED_ARTICLE_CATEGORY_OPTIONS: {
    value: FeedArticleCategory;
    label: string;
}[] = (Object.keys(ARTICLE_CATEGORY_OPTIONS) as ArticleCategoryEnum[])
    .filter((k) => k !== ArticleCategoryEnum.SYSTEM)
    .map((k) => ({
        value: k as FeedArticleCategory,
        label: ARTICLE_CATEGORY_OPTIONS[k].title_ua,
    }));

const ALL_FEED_CONTENT_TYPES: FeedContentType[] = [
    ContentTypeEnum.COMMENT,
    ContentTypeEnum.ARTICLE,
    ContentTypeEnum.COLLECTION,
];

function isSectionEnabled(
    feedContentTypes: FeedContentType[] | null,
    type: FeedContentType,
): boolean {
    return feedContentTypes === null || feedContentTypes.includes(type);
}

function toggleSection(
    feedContentTypes: FeedContentType[] | null,
    type: FeedContentType,
    enabled: boolean,
): FeedContentType[] | null {
    const current = feedContentTypes ?? [...ALL_FEED_CONTENT_TYPES];

    if (enabled) {
        const next = current.includes(type) ? current : [...current, type];
        return next.length === ALL_FEED_CONTENT_TYPES.length ? null : next;
    }

    const next = current.filter((t) => t !== type);
    return next.length === 0 ? next : next;
}

function toggleSubType<T extends string>(
    array: T[] | null,
    value: T,
    allValues: T[],
): T[] | null {
    if (array === null) {
        return allValues.filter((v) => v !== value);
    }

    const has = array.includes(value);

    if (has) {
        const next = array.filter((v) => v !== value);
        return next.length === 0 ? null : next;
    }

    const next = [...array, value];
    return next.length === allValues.length ? null : next;
}

function isSubTypeChecked<T extends string>(
    array: T[] | null,
    value: T,
): boolean {
    return array === null || array.includes(value);
}

function hasActiveFilters(value: FeedSubTypeFilters): boolean {
    return (
        value.feed_content_types !== null ||
        value.comment_content_types !== null ||
        value.article_content_types !== null ||
        value.article_categories !== null ||
        value.collection_content_types !== null
    );
}

interface SwitchRowProps {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

const SwitchRow: FC<SwitchRowProps> = ({
    label,
    checked,
    onCheckedChange,
    disabled,
}) => {
    const id = useId();

    return (
        <div className="flex items-center justify-between gap-4">
            <Label htmlFor={id} className="flex-1">
                {label}
            </Label>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
            />
        </div>
    );
};

interface SectionProps {
    title: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    children: React.ReactNode;
}

const Section: FC<SectionProps> = ({ title, enabled, onToggle, children }) => {
    const id = useId();

    return (
        <div className="flex flex-col gap-6 bg-secondary/20 border rounded-md p-4">
            <div className="flex items-center gap-4 justify-between">
                <Label htmlFor={id} className="text-base flex-1">
                    {title}
                </Label>
                <Switch id={id} checked={enabled} onCheckedChange={onToggle} />
            </div>
            <div
                className={cn(
                    'flex flex-col gap-6 transition-opacity duration-200',
                    !enabled && 'pointer-events-none opacity-40',
                )}
            >
                {children}
            </div>
        </div>
    );
};

interface SubSectionProps {
    title: string;
    children: React.ReactNode;
}

const SubSection: FC<SubSectionProps> = ({ title, children }) => (
    <div className="flex flex-col gap-4">
        <span className="text-muted-foreground text-sm">{title}</span>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">{children}</div>
    </div>
);

const FeedSubTypeSelect: FC<{
    value: FeedSubTypeFilters;
    onChange: (filters: FeedSubTypeFilters) => void;
}> = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);

    const commentsEnabled = isSectionEnabled(
        value.feed_content_types,
        ContentTypeEnum.COMMENT,
    );
    const articlesEnabled = isSectionEnabled(
        value.feed_content_types,
        ContentTypeEnum.ARTICLE,
    );
    const collectionsEnabled = isSectionEnabled(
        value.feed_content_types,
        ContentTypeEnum.COLLECTION,
    );

    const handleSectionToggle = (type: FeedContentType, enabled: boolean) => {
        onChange({
            ...value,
            feed_content_types: toggleSection(
                value.feed_content_types,
                type,
                enabled,
            ),
        });
    };

    return (
        <>
            <Button
                variant="outline"
                size="icon-md"
                onClick={() => setOpen(true)}
                className="relative"
            >
                <AntDesignFilterFilled />
                {hasActiveFilters(value) && (
                    <span className="bg-primary-foreground absolute -top-1 -right-1 size-2.5 rounded-full" />
                )}
            </Button>

            <ResponsiveModal open={open} onOpenChange={setOpen}>
                <ResponsiveModalContent
                    title="Фільтри стрічки"
                    className="md:max-w-lg"
                >
                    <div className="-m-4 flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                        <Section
                            title="Коментарі"
                            enabled={commentsEnabled}
                            onToggle={(v) =>
                                handleSectionToggle(ContentTypeEnum.COMMENT, v)
                            }
                        >
                            <SubSection title="Тип контенту">
                                {COMMENT_OPTIONS.map((opt) => (
                                    <SwitchRow
                                        key={opt.value}
                                        label={opt.label}
                                        checked={isSubTypeChecked(
                                            value.comment_content_types,
                                            opt.value,
                                        )}
                                        onCheckedChange={() =>
                                            onChange({
                                                ...value,
                                                comment_content_types:
                                                    toggleSubType(
                                                        value.comment_content_types,
                                                        opt.value,
                                                        COMMENT_OPTIONS.map(
                                                            (o) => o.value,
                                                        ),
                                                    ),
                                            })
                                        }
                                        disabled={!commentsEnabled}
                                    />
                                ))}
                            </SubSection>
                        </Section>

                        <Section
                            title="Статті"
                            enabled={articlesEnabled}
                            onToggle={(v) =>
                                handleSectionToggle(ContentTypeEnum.ARTICLE, v)
                            }
                        >
                            <SubSection title="Тип контенту">
                                {ARTICLE_CONTENT_OPTIONS.map((opt) => (
                                    <SwitchRow
                                        key={opt.value}
                                        label={opt.label}
                                        checked={isSubTypeChecked(
                                            value.article_content_types,
                                            opt.value,
                                        )}
                                        onCheckedChange={() =>
                                            onChange({
                                                ...value,
                                                article_content_types:
                                                    toggleSubType(
                                                        value.article_content_types,
                                                        opt.value,
                                                        ARTICLE_CONTENT_OPTIONS.map(
                                                            (o) => o.value,
                                                        ),
                                                    ),
                                            })
                                        }
                                        disabled={!articlesEnabled}
                                    />
                                ))}
                            </SubSection>

                            <SubSection title="Категорія">
                                {FEED_ARTICLE_CATEGORY_OPTIONS.map((opt) => (
                                    <SwitchRow
                                        key={opt.value}
                                        label={opt.label}
                                        checked={isSubTypeChecked(
                                            value.article_categories,
                                            opt.value,
                                        )}
                                        onCheckedChange={() =>
                                            onChange({
                                                ...value,
                                                article_categories:
                                                    toggleSubType(
                                                        value.article_categories,
                                                        opt.value,
                                                        FEED_ARTICLE_CATEGORY_OPTIONS.map(
                                                            (o) => o.value,
                                                        ),
                                                    ),
                                            })
                                        }
                                        disabled={!articlesEnabled}
                                    />
                                ))}
                            </SubSection>
                        </Section>

                        <Section
                            title="Колекції"
                            enabled={collectionsEnabled}
                            onToggle={(v) =>
                                handleSectionToggle(
                                    ContentTypeEnum.COLLECTION,
                                    v,
                                )
                            }
                        >
                            <SubSection title="Тип контенту">
                                {COLLECTION_CONTENT_TYPE_OPTIONS.map((opt) => (
                                    <SwitchRow
                                        key={opt.value}
                                        label={opt.label}
                                        checked={isSubTypeChecked(
                                            value.collection_content_types,
                                            opt.value as CollectionContentType,
                                        )}
                                        onCheckedChange={() =>
                                            onChange({
                                                ...value,
                                                collection_content_types:
                                                    toggleSubType(
                                                        value.collection_content_types,
                                                        opt.value as CollectionContentType,
                                                        COLLECTION_CONTENT_TYPE_OPTIONS.map(
                                                            (o) =>
                                                                o.value as CollectionContentType,
                                                        ),
                                                    ),
                                            })
                                        }
                                        disabled={!collectionsEnabled}
                                    />
                                ))}
                            </SubSection>
                        </Section>
                    </div>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default FeedSubTypeSelect;
