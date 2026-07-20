import { type FC, useId, useState } from 'react';

import { Filter } from 'lucide-react';

import {
    ArticleCategoryEnum,
    ContentTypeEnum,
    type UiFeedSettingsOutput,
} from '@hikka/api';

import { Badge } from '@/components/ui/badge';
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

type FeedContentType = NonNullable<
    UiFeedSettingsOutput['feed_content_types']
>[number];

export type FeedSubTypeFilters = {
    feed_content_types: FeedContentType[] | null;
    comment_content_types: NonNullable<
        UiFeedSettingsOutput['comment_content_types']
    > | null;
    article_content_types: NonNullable<
        UiFeedSettingsOutput['article_content_types']
    > | null;
    article_categories: NonNullable<
        UiFeedSettingsOutput['article_categories']
    > | null;
    collection_content_types: NonNullable<
        UiFeedSettingsOutput['collection_content_types']
    > | null;
    review_content_types: NonNullable<
        UiFeedSettingsOutput['review_content_types']
    > | null;
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
    sectionType: FeedContentType;
    groups: GroupConfig[];
};

const REVIEW: FeedContentType = 'review';

const ALL_FEED_CONTENT_TYPES: FeedContentType[] = [
    ContentTypeEnum.COMMENT,
    ContentTypeEnum.ARTICLE,
    ContentTypeEnum.COLLECTION,
    REVIEW,
];

const COMMENT_OPTIONS: SubTypeOption[] = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
    ContentTypeEnum.COLLECTION,
    ContentTypeEnum.ARTICLE,
    ContentTypeEnum.EDIT,
].map((v) => ({ value: v, label: CONTENT_TYPES[v].title_ua }));

const ARTICLE_CONTENT_OPTIONS: SubTypeOption[] = [
    { value: ContentTypeEnum.ANIME, label: CONTENT_TYPES.anime.title_ua },
    { value: ContentTypeEnum.MANGA, label: CONTENT_TYPES.manga.title_ua },
    { value: ContentTypeEnum.NOVEL, label: CONTENT_TYPES.novel.title_ua },
    { value: 'no_content', label: 'Без контенту' },
];

const FEED_ARTICLE_CATEGORY_OPTIONS: SubTypeOption[] = (
    Object.keys(ARTICLE_CATEGORY_OPTIONS) as ArticleCategoryEnum[]
)
    .filter((k) => k !== ArticleCategoryEnum.SYSTEM)
    .map((k) => ({ value: k, label: ARTICLE_CATEGORY_OPTIONS[k].title_ua }));

const REVIEW_CONTENT_OPTIONS: SubTypeOption[] = [
    { value: ContentTypeEnum.ANIME, label: CONTENT_TYPES.anime.title_ua },
    { value: ContentTypeEnum.MANGA, label: CONTENT_TYPES.manga.title_ua },
    { value: ContentTypeEnum.NOVEL, label: CONTENT_TYPES.novel.title_ua },
];

const SECTIONS: SectionConfig[] = [
    {
        title: 'Коментарі',
        sectionType: ContentTypeEnum.COMMENT,
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
        sectionType: ContentTypeEnum.ARTICLE,
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
        sectionType: ContentTypeEnum.COLLECTION,
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
        sectionType: REVIEW,
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

// Counts only the granular sub-type filter groups — top-level type (quick-filter
// chips) and scope (tabs) are visible in the header, so they don't add to the badge.
function activeSubFilterCount(value: FeedSubTypeFilters): number {
    return SECTIONS.flatMap((s) => s.groups).filter(
        (g) => value[g.key] !== null,
    ).length;
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

    const handleSubTypeToggle = (
        group: GroupConfig,
        sectionType: FeedContentType,
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
                size="icon-md"
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

            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
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
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default FeedSubTypeSelect;
