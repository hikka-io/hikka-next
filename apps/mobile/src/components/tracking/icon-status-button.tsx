import type { FC } from 'react';

import { useRouter } from 'expo-router';
import { RotateCw } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';

import type { MainContentTypeEnum } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import { LOGIN_HREF, listEntryHref } from './list-entry-href';
import { findStatus, STATUS_OPTIONS, statusStyle } from './status-config';
import StatusIcon from './status-icon';
import { kindOf, type ListEntry, PLANNED_STATUS } from './tracking-body';
import { useListEntry } from './use-list-entry';
import { useSaveListEntry } from './use-tracking-mutations';

type Props = {
    contentType: MainContentTypeEnum;
    slug: string;
    /** Pass the embedded entry from list responses (`item.watch[0] ?? null`) to skip a fetch per card. */
    entry?: ListEntry | null;
    size?: 'icon-sm' | 'icon-md';
    className?: string;
    containerClassName?: string;
};

/** The web's `IconStatusButton` for `PosterCard`'s `overlay`: add to planned, or open the edit sheet. */
const IconStatusButton: FC<Props> = ({
    contentType,
    slug,
    entry: suppliedEntry,
    size = 'icon-sm',
    className,
    containerClassName,
}) => {
    const router = useRouter();
    const kind = kindOf(contentType);
    const entryState = useListEntry({
        contentType,
        slug,
        entry: suppliedEntry,
    });
    const save = useSaveListEntry();
    const pending = save.isPending && save.variables?.slug === slug;
    const plannedGlyph = STATUS_OPTIONS[kind][0].glyph;

    if (entryState.state === 'error') {
        return (
            <Button
                variant="secondary"
                size={size}
                accessibilityLabel="Повторити завантаження списку"
                className={className}
                containerClassName={containerClassName}
                onPress={entryState.retry}
            >
                <Icon as={RotateCw} />
            </Button>
        );
    }

    if (entryState.state === 'tracked') {
        const status = findStatus(kind, entryState.entry.status);
        const style = statusStyle(status?.value);

        return (
            <Button
                variant="secondary"
                size={size}
                accessibilityLabel={`Список: ${status?.title ?? ''}`}
                disabled={pending}
                className={cn('border', style.surface, className)}
                textClassName={style.text}
                containerClassName={containerClassName}
                onPress={() => router.push(listEntryHref(contentType, slug))}
            >
                {pending ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <StatusIcon glyph={status?.glyph ?? plannedGlyph} />
                )}
            </Button>
        );
    }

    const blocked = entryState.state === 'loading' || pending;

    return (
        <Button
            variant="secondary"
            size={size}
            accessibilityLabel="Додати в заплановане"
            disabled={blocked}
            className={className}
            containerClassName={containerClassName}
            onPress={() => {
                if (entryState.state === 'signed-out') {
                    router.push(LOGIN_HREF);
                    return;
                }
                save.mutate({
                    contentType,
                    slug,
                    body: { status: PLANNED_STATUS[kind] },
                });
            }}
        >
            {pending ? (
                <ActivityIndicator size="small" />
            ) : (
                <StatusIcon glyph={plannedGlyph} />
            )}
        </Button>
    );
};

export default IconStatusButton;
