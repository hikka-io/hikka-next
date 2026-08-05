import { Fragment, type ReactNode, useState } from 'react';

import type {
    AnimeResponse,
    CharacterResponse,
    EditContentTypeEnum,
    MangaResponse,
    NovelResponse,
    PersonResponse,
    TodoCharacterIssuesInfo,
    TodoContentIssuesInfo,
    TodoPersonIssuesInfo,
} from '@hikka/api';

import { ContentCard } from '@/components/content-card';
import { CompanyTitleLink } from '@/components/content-list/company-title-link';
import { MagazineTitleLink } from '@/components/content-list/magazine-title-link';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsFace3 from '@/components/icons/material-symbols/MaterialSymbolsFace3';
import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
import { badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    HorizontalCardDescription,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import Link from '@/components/ui/link';
import { useTitle } from '@/features/auth';
import { cn } from '@/utils/cn';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants/common';
import { QuickEditButton } from '../quick-edit';

/** Every `/edit/todo/*` entry is `{ item, issues }` — only the shapes differ. */
type TodoContentItem =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | CharacterResponse
    | PersonResponse;

type TodoContentIssues =
    | TodoContentIssuesInfo
    | TodoCharacterIssuesInfo
    | TodoPersonIssuesInfo;

const isMediaContent = (
    item: TodoContentItem,
): item is AnimeResponse | MangaResponse | NovelResponse =>
    item.data_type === 'anime' ||
    item.data_type === 'manga' ||
    item.data_type === 'novel';

const CardActions = ({
    contentType,
    slug,
}: {
    contentType: EditContentTypeEnum;
    slug: string;
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground"
                aria-label="Більше"
            >
                <MaterialSymbolsMoreHoriz />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
                <Link
                    to="/edit/content"
                    search={{
                        tab: 'character',
                        content_type: contentType,
                        content_slug: slug,
                    }}
                >
                    <MaterialSymbolsFace3 />
                    Персонажі
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link
                    to="/edit/content"
                    search={{
                        tab: 'person',
                        content_type: contentType,
                        content_slug: slug,
                    }}
                >
                    <MaterialSymbolsPerson />
                    Люди
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

/**
 * Labels for every issue flag across the three issue shapes (titles, characters,
 * people). Key order doubles as chip order, so a card lists its gaps in the same
 * sequence no matter how the API serialises the object.
 */
const ISSUE_LABELS: Record<string, string> = {
    title_ua_absent: 'Назва (укр)',
    title_en_absent: 'Назва (англ)',
    title_original_absent: 'Назва (ориг)',
    name_ua_absent: "Ім'я (укр)",
    name_en_absent: "Ім'я (англ)",
    name_original_absent: "Ім'я (ориг)",
    synopsis_ua_absent: 'Опис (укр)',
    synopsis_en_absent: 'Опис (англ)',
    description_ua_absent: 'Опис (укр)',
};

const getIssueKeys = (issues: TodoContentIssues) =>
    Object.keys(ISSUE_LABELS).filter(
        (key) => (issues as Record<string, boolean | undefined>)[key],
    );

type IssuesProps = {
    issues: TodoContentIssues;
    maxItems?: number;
};

/** Missing-data flags as badges on a single row, overflow collapsed into `+N`. */
function TodoContentIssues(props: IssuesProps) {
    const { issues, maxItems } = props;
    const keys = getIssueKeys(issues);

    const [expanded, setExpanded] = useState(false);

    if (keys.length === 0) {
        return null;
    }

    const collapsed =
        !expanded && maxItems != null && maxItems > 0 && keys.length > maxItems;

    const visibleKeys = collapsed ? keys.slice(0, maxItems) : keys;

    return (
        <div className="flex flex-wrap gap-1.5">
            {visibleKeys.map((key) => (
                <div
                    key={key}
                    className={cn(
                        badgeVariants({ variant: 'secondary' }),
                        'min-w-0 shrink truncate',
                    )}
                >
                    {ISSUE_LABELS[key]}
                </div>
            ))}
            {collapsed && (
                <div
                    className={cn(
                        badgeVariants({ variant: 'secondary' }),
                        'cursor-pointer bg-transparent hover:bg-secondary',
                    )}
                    onClick={() => setExpanded(true)}
                >
                    +{keys.length - maxItems}
                </div>
            )}
        </div>
    );
}

type Props = {
    item: TodoContentItem;
    issues: TodoContentIssues;
};

/**
 * Card for the `/edit/todo` lists — renders any of the five sources (anime,
 * manga, novel, character, person) identically: poster, title, the missing-data
 * chips and the edit actions.
 */
export function TodoContentCard(props: Props) {
    const { item, issues } = props;

    const title = useTitle(item);
    const contentType = item.data_type as EditContentTypeEnum;
    const href = `/${contentType}/${item.slug}`;

    let CompanyView: ReactNode;
    let mediaType: string | undefined;
    let year: number | null | undefined;
    let status: string | undefined;

    const isMedia = isMediaContent(item);

    if (isMedia) {
        if ('studios' in item) {
            const studio = item.studios?.[0];

            if (studio) {
                CompanyView = <CompanyTitleLink studio={studio} />;
            }
        } else if ('magazines' in item) {
            const magazine = item.magazines?.[0];

            if (magazine) {
                CompanyView = (
                    <MagazineTitleLink
                        magazine={magazine}
                        type={item.data_type}
                    />
                );
            }
        }

        mediaType = item.media_type
            ? MEDIA_TYPE[item.media_type as keyof typeof MEDIA_TYPE]?.title_ua
            : undefined;
        year = item.year;
        status = item.status
            ? RELEASE_STATUS[item.status as keyof typeof RELEASE_STATUS]
                  ?.title_ua
            : undefined;
    }

    return (
        <div className="surface -mx-4 flex flex-col gap-4 rounded-none border border-border border-x-0 p-4 max-md:not-first:-mt-px md:mx-0 md:rounded-(--base-radius) md:border-x">
            <div className="flex gap-4">
                <ContentCard
                    className="w-20 shrink-0 sm:w-24"
                    containerClassName="rounded-(--base-radius)"
                    imagePreset="cardXs"
                    image={item.image}
                    href={href}
                    content_type={contentType}
                    slug={item.slug}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <HorizontalCardTitle
                        to={href}
                        className="min-w-0 font-semibold text-base"
                        titleMeta={
                            isMedia && (
                                <CardActions
                                    contentType={contentType}
                                    slug={item.slug}
                                />
                            )
                        }
                    >
                        {title}
                    </HorizontalCardTitle>
                    {isMedia && (
                        <HorizontalCardDescription className="flex-wrap">
                            {CompanyView && (
                                <>
                                    {CompanyView}
                                    <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                                </>
                            )}
                            {[mediaType, year, status]
                                .filter(Boolean)
                                .map((info, index) => (
                                    <Fragment key={String(info)}>
                                        {index > 0 && (
                                            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                                        )}
                                        {info}
                                    </Fragment>
                                ))}
                        </HorizontalCardDescription>
                    )}

                    <TodoContentIssues issues={issues} maxItems={3} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button size="md" className="min-w-0 flex-1" asChild>
                    <Link
                        to="/edit/new"
                        search={{
                            slug: item.slug,
                            content_type: contentType,
                        }}
                    >
                        <MaterialSymbolsEditRounded />
                        <span className="truncate">Створити правку</span>
                    </Link>
                </Button>
                <QuickEditButton slug={item.slug} content_type={contentType} />
            </div>
        </div>
    );
}
