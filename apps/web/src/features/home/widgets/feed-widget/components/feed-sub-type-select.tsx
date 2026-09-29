import { type FC, useId, useState } from 'react';

import { Filter } from 'lucide-react';

import {
    FeedArticleCategoryEnum,
    FeedArticleContentTypeEnum,
    type FeedCollectionContentTypeEnum,
    FeedCommentContentTypeEnum,
    FeedContentTypeEnum,
    FeedReviewContentTypeEnum,
} from '@hikka/api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils/cn';
import {
    COLLECTION_CONTENT_TYPE_OPTIONS,
    CONTENT_TYPES,
} from '@/utils/labels/content-types';
import { ARTICLE_CATEGORY } from '@/utils/labels/enum-labels';

export type FeedSubTypeFilters = {
    feed_content_types: FeedContentTypeEnum[] | null;
    comment_content_types: FeedCommentContentTypeEnum[] | null;
    article_content_types: FeedArticleContentTypeEnum[] | null;
    article_categories: FeedArticleCategoryEnum[] | null;
    collection_content_types: FeedCollectionContentTypeEnum[] | null;
    review_content_types: FeedReviewContentTypeEnum[] | null;
};

type GroupKey = Exclude<keyof FeedSubTypeFilters, 'feed_content_types'>;

type SubTypeOption = { value: string; label: string };

type GroupConfig = {
    title: string;
    key: GroupKey;
    options: SubTypeOption[];
};

type SectionConfig = {
    title: string;
    sectionType: FeedContentTypeEnum;
    groups: GroupConfig[];
};

function toOptions(labels: Record<string, string>): SubTypeOption[] {
    return Object.entries(labels).map(([value, label]) => ({ value, label }));
}

const ALL_FEED_CONTENT_TYPES = [
    FeedContentTypeEnum.COMMENT,
    FeedContentTypeEnum.ARTICLE,
    FeedContentTypeEnum.COLLECTION,
    FeedContentTypeEnum.REVIEW,
] as const satisfies readonly FeedContentTypeEnum[];

const COMMENT_OPTIONS = toOptions({
    [FeedCommentContentTypeEnum.ANIME]: CONTENT_TYPES.anime.title_ua,
    [FeedCommentContentTypeEnum.MANGA]: CONTENT_TYPES.manga.title_ua,
    [FeedCommentContentTypeEnum.NOVEL]: CONTENT_TYPES.novel.title_ua,
    [FeedCommentContentTypeEnum.CHARACTER]: CONTENT_TYPES.character.title_ua,
    [FeedCommentContentTypeEnum.PERSON]: CONTENT_TYPES.person.title_ua,
    [FeedCommentContentTypeEnum.COLLECTION]: CONTENT_TYPES.collection.title_ua,
    [FeedCommentContentTypeEnum.ARTICLE]: CONTENT_TYPES.article.title_ua,
    [FeedCommentContentTypeEnum.EDIT]: CONTENT_TYPES.edit.title_ua,
} satisfies Record<FeedCommentContentTypeEnum, string>);

const ARTICLE_CONTENT_OPTIONS = toOptions({
    [FeedArticleContentTypeEnum.ANIME]: CONTENT_TYPES.anime.title_ua,
    [FeedArticleContentTypeEnum.MANGA]: CONTENT_TYPES.manga.title_ua,
    [FeedArticleContentTypeEnum.NOVEL]: CONTENT_TYPES.novel.title_ua,
    [FeedArticleContentTypeEnum.NO_CONTENT]: 'Без контенту',
} satisfies Record<FeedArticleContentTypeEnum, string>);

const FEED_ARTICLE_CATEGORY_OPTIONS = toOptions({
    [FeedArticleCategoryEnum.NEWS]: ARTICLE_CATEGORY.news.title_ua,
    [FeedArticleCategoryEnum.REVIEWS]: ARTICLE_CATEGORY.reviews.title_ua,
    [FeedArticleCategoryEnum.ORIGINAL]: ARTICLE_CATEGORY.original.title_ua,
} satisfies Record<FeedArticleCategoryEnum, string>);

const REVIEW_CONTENT_OPTIONS = toOptions({
    [FeedReviewContentTypeEnum.ANIME]: CONTENT_TYPES.anime.title_ua,
    [FeedReviewContentTypeEnum.MANGA]: CONTENT_TYPES.manga.title_ua,
    [FeedReviewContentTypeEnum.NOVEL]: CONTENT_TYPES.novel.title_ua,
} satisfies Record<FeedReviewContentTypeEnum, string>);

const SECTIONS: SectionConfig[] = [
    {
        title: 'Коментарі',
        sectionType: FeedContentTypeEnum.COMMENT,
        groups: [
            {
                title: 'Тип контенту',
                key: 'comment_content_types',
                options: COMMENT_OPTIONS,
            },
        ],
    },
    {
        title: 'Статті',
        sectionType: FeedContentTypeEnum.ARTICLE,
        groups: [
            {
                title: 'Тип контенту',
                key: 'article_content_types',
                options: ARTICLE_CONTENT_OPTIONS,
            },
            {
                title: 'Категорія',
                key: 'article_categories',
                options: FEED_ARTICLE_CATEGORY_OPTIONS,
            },
        ],
    },
    {
        title: 'Колекції',
        sectionType: FeedContentTypeEnum.COLLECTION,
        groups: [
            {
                title: 'Тип контенту',
                key: 'collection_content_types',
                options: COLLECTION_CONTENT_TYPE_OPTIONS,
            },
        ],
    },
    {
        title: 'Відгуки',
        sectionType: FeedContentTypeEnum.REVIEW,
        groups: [
            {
                title: 'Тип контенту',
                key: 'review_content_types',
                options: REVIEW_CONTENT_OPTIONS,
            },
        ],
    },
];

function isSectionEnabled(
    feedContentTypes: FeedContentTypeEnum[] | null,
    type: FeedContentTypeEnum,
): boolean {
    return feedContentTypes === null || feedContentTypes.includes(type);
}

function toggleSection(
    feedContentTypes: FeedContentTypeEnum[] | null,
    type: FeedContentTypeEnum,
    enabled: boolean,
): FeedContentTypeEnum[] | null {
    const current = feedContentTypes ?? [...ALL_FEED_CONTENT_TYPES];

    if (enabled) {
        const next = current.includes(type) ? current : [...current, type];
        return next.length === ALL_FEED_CONTENT_TYPES.length ? null : next;
    }

    return current.filter((t) => t !== type);
}

function toggleSubType(
    array: string[] | null,
    value: string,
    allValues: string[],
): string[] | null {
    if (array === null) {
        return allValues.filter((v) => v !== value);
    }

    if (array.includes(value)) {
        return array.filter((v) => v !== value);
    }

    const next = [...array, value];
    return next.length === allValues.length ? null : next;
}

function isSubTypeChecked(array: string[] | null, value: string): boolean {
    return array === null || array.includes(value);
}

function activeSubFilterCount(value: FeedSubTypeFilters): number {
    return SECTIONS.reduce((count, section) => {
        if (!isSectionEnabled(value.feed_content_types, section.sectionType)) {
            return count + 1;
        }

        return (
            count +
            section.groups.reduce((groupCount, group) => {
                const selected = value[group.key];
                if (selected === null) return groupCount;

                return (
                    groupCount +
                    group.options.filter(
                        (o) =>
                            !(selected as readonly string[]).includes(o.value),
                    ).length
                );
            }, 0)
        );
    }, 0);
}

type SwitchRowProps = {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
};

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

type SectionProps = {
    title: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    children: React.ReactNode;
};

const Section: FC<SectionProps> = ({ title, enabled, onToggle, children }) => {
    const id = useId();

    return (
        <div className="surface flex flex-col gap-6 rounded-md border p-4">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor={id} className="flex-1 text-base">
                    {title}
                </Label>
                <Switch id={id} checked={enabled} onCheckedChange={onToggle} />
            </div>
            <div
                className={cn(
                    'flex flex-col gap-6 transition-opacity duration-200',
                    !enabled && 'opacity-40',
                )}
            >
                {children}
            </div>
        </div>
    );
};

type SubSectionProps = {
    title: string;
    children: React.ReactNode;
};

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

    const handleSectionToggle = (
        type: FeedContentTypeEnum,
        enabled: boolean,
    ) => {
        onChange({
            ...value,
            feed_content_types: toggleSection(
                value.feed_content_types,
                type,
                enabled,
            ),
        });
    };

    const handleSubTypeToggle = (
        group: GroupConfig,
        sectionType: FeedContentTypeEnum,
        option: string,
    ) => {
        const next = toggleSubType(
            value[group.key],
            option,
            group.options.map((o) => o.value),
        );

        if (next !== null && next.length === 0) {
            onChange({
                ...value,
                [group.key]: null,
                feed_content_types: toggleSection(
                    value.feed_content_types,
                    sectionType,
                    false,
                ),
            } as FeedSubTypeFilters);
            return;
        }

        onChange({ ...value, [group.key]: next } as FeedSubTypeFilters);
    };

    const subFilterCount = activeSubFilterCount(value);

    return (
        <>
            <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setOpen(true)}
                className="relative shrink-0 overflow-visible"
                aria-label="Фільтри"
            >
                <Filter className="size-4" />
                {subFilterCount > 0 && (
                    <Badge
                        variant="default"
                        className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px]"
                    >
                        {subFilterCount}
                    </Badge>
                )}
            </Button>

            <ResponsiveModal open={open} onOpenChange={setOpen} mobile="page">
                <ResponsiveModalContent
                    title="Фільтри стрічки"
                    className="md:max-w-lg"
                >
                    <div className="-m-4 flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                        {SECTIONS.map((section) => {
                            const enabled = isSectionEnabled(
                                value.feed_content_types,
                                section.sectionType,
                            );

                            return (
                                <Section
                                    key={section.title}
                                    title={section.title}
                                    enabled={enabled}
                                    onToggle={(v) =>
                                        handleSectionToggle(
                                            section.sectionType,
                                            v,
                                        )
                                    }
                                >
                                    {section.groups.map((group) => (
                                        <SubSection
                                            key={group.key}
                                            title={group.title}
                                        >
                                            {group.options.map((opt) => (
                                                <SwitchRow
                                                    key={opt.value}
                                                    label={opt.label}
                                                    checked={isSubTypeChecked(
                                                        value[group.key],
                                                        opt.value,
                                                    )}
                                                    onCheckedChange={() =>
                                                        handleSubTypeToggle(
                                                            group,
                                                            section.sectionType,
                                                            opt.value,
                                                        )
                                                    }
                                                    disabled={!enabled}
                                                />
                                            ))}
                                        </SubSection>
                                    ))}
                                </Section>
                            );
                        })}
                    </div>
                    <ResponsiveModalFooter>
                        <Button size="md" onClick={() => setOpen(false)}>
                            Готово
                        </Button>
                    </ResponsiveModalFooter>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default FeedSubTypeSelect;
