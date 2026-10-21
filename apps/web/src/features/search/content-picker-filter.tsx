import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { CollectionContentTypeEnum } from '@hikka/api';

import ContentRefChip from '@/components/content-ref-chip';
import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import MaterialSymbolsCloseRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseRounded';
import MaterialSymbolsSearchRounded from '@/components/icons/material-symbols/MaterialSymbolsSearchRounded';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTitle } from '@/services/session';
import { contentInfoOptions } from '@/utils/api/content-queries';

import SearchModal from './search-modal';

type Props = {
    label: string;
    contentType: CollectionContentTypeEnum;
    slug: string | undefined;
    onChange: (slug: string | undefined) => void;
};

/** A filter field that picks one title, character or person of a fixed type through the search modal. */
const ContentPickerFilter: FC<Props> = ({
    label,
    contentType,
    slug,
    onChange,
}) => {
    const [open, setOpen] = useState(false);
    const { data } = useQuery({
        ...contentInfoOptions(contentType, slug ?? ''),
        enabled: Boolean(slug),
    });
    const title = useTitle(data) || slug;
    const Icon = CONTENT_TYPE_ICONS[contentType];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-4 shrink-0" />
                <Label>{label}</Label>
            </div>
            {slug ? (
                <div className="flex min-w-0 items-center gap-1">
                    <ContentRefChip
                        contentType={contentType}
                        slug={slug}
                        title={title}
                        aria-label={`Змінити: ${title}`}
                        onClick={() => setOpen(true)}
                    />
                    <Button
                        size="icon-xs"
                        variant="ghost"
                        aria-label="Прибрати"
                        onClick={() => onChange(undefined)}
                    >
                        <MaterialSymbolsCloseRounded />
                    </Button>
                </div>
            ) : (
                <Button
                    variant="outline"
                    size="md"
                    className="justify-start text-muted-foreground"
                    onClick={() => setOpen(true)}
                >
                    <MaterialSymbolsSearchRounded /> Знайти...
                </Button>
            )}
            <SearchModal
                open={open}
                onOpenChange={setOpen}
                content_type={contentType}
                disableHotkey
                type="button"
                onClick={(content) => {
                    if ('slug' in content) onChange(content.slug);
                }}
            />
        </div>
    );
};

export default ContentPickerFilter;
