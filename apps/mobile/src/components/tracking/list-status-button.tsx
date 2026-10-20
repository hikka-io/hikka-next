import { type FC, type ReactElement, type ReactNode, useState } from 'react';

import { useRouter } from 'expo-router';
import { ChevronDown, RotateCw, Settings } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import type { MainContentTypeEnum } from '@hikka/api';

import { Button, buttonVariants } from '@/components/ui/button';
import { Icon, IconClassContext } from '@/components/ui/icon';
import { Text, TextClassContext } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import { LOGIN_HREF, listEntryHref } from './list-entry-href';
import NativeMenu from './native-menu';
import { findStatus, STATUS_OPTIONS, statusStyle } from './status-config';
import StatusIcon from './status-icon';
import {
    buildStatusBody,
    kindOf,
    type ListEntry,
    PLANNED_STATUS,
    type ProgressTotals,
} from './tracking-body';
import { useListEntry } from './use-list-entry';
import { useSaveListEntry, useSavePending } from './use-tracking-mutations';

const ADD_LABEL = 'Додати у список';
const SETTINGS = 'settings';
const CHEVRON_WIDTH = 40;
// The SwiftUI menu host does not report its size to Yoga: every trigger sits in an explicit box.
const TRIGGER_HEIGHT = 44;

type Props = {
    contentType: MainContentTypeEnum;
    slug: string;
    /** `undefined` fetches the entry; `null` means known untracked. */
    entry?: ListEntry | null;
    /** Totals for the COMPLETED fill (episodes, chapters, volumes). */
    content?: ProgressTotals;
    className?: string;
};

type SegmentProps = {
    accessibilityLabel: string;
    width: number;
    className?: string;
    textClassName?: string;
    disabled?: boolean;
    children: ReactNode;
};

// A menu trigger is a plain view: the native menu owns the tap, so it cannot be a Pressable.
const Segment: FC<SegmentProps> = ({
    accessibilityLabel,
    width,
    className,
    textClassName,
    disabled,
    children,
}) => (
    <TextClassContext.Provider
        value={cn(
            'font-medium text-secondary-foreground text-sm',
            textClassName,
        )}
    >
        <IconClassContext.Provider value="size-4">
            <View
                style={{ width, height: TRIGGER_HEIGHT }}
                className="justify-center"
            >
                <View
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={accessibilityLabel}
                    accessibilityState={{ disabled }}
                    className={cn(
                        buttonVariants({ variant: 'secondary', size: 'md' }),
                        disabled && 'opacity-50',
                        className,
                    )}
                >
                    {children}
                </View>
            </View>
        </IconClassContext.Provider>
    </TextClassContext.Provider>
);

/** The detail-header control (the web's `WatchListButton`/`ReadListButton`): status menu plus settings. */
const ListStatusButton: FC<Props> = ({
    contentType,
    slug,
    entry: suppliedEntry,
    content,
    className,
}) => {
    const router = useRouter();
    const kind = kindOf(contentType);
    const entryState = useListEntry({
        contentType,
        slug,
        entry: suppliedEntry,
    });
    const save = useSaveListEntry();
    const [fillWidth, setFillWidth] = useState(0);
    // Slug-bound and shared: a recycled cell ignores another title's write, and the header
    // button and a poster overlay for the same title wait for each other.
    const pending = useSavePending(slug);
    const tracked =
        entryState.state === 'tracked' ? entryState.entry : undefined;

    if (entryState.state === 'signed-out') {
        return (
            <Button
                variant="secondary"
                size="md"
                containerClassName={cn('self-stretch', className)}
                className="w-full"
                onPress={() => router.push(LOGIN_HREF)}
            >
                <StatusIcon glyph={STATUS_OPTIONS[kind][0].glyph} />
                {ADD_LABEL}
            </Button>
        );
    }

    if (entryState.state === 'error') {
        return (
            <Button
                variant="outline"
                size="md"
                containerClassName={cn('self-stretch', className)}
                className="w-full"
                onPress={entryState.retry}
            >
                <Icon as={RotateCw} />
                Не вдалося завантажити список
            </Button>
        );
    }

    const blocked = entryState.state === 'loading' || pending;

    // The snapshot is taken at tap time from the entry on screen; a second tap waits for the first write.
    const changeStatus = (status: string) => {
        if (blocked) return;
        save.mutate({
            contentType,
            slug,
            body: buildStatusBody(kind, status, tracked, content),
        });
    };

    const handleAction = (id: string) => {
        if (id === SETTINGS) {
            router.push(listEntryHref(contentType, slug));
            return;
        }
        if (id !== tracked?.status) {
            changeStatus(id);
        }
    };

    const actions = [
        ...STATUS_OPTIONS[kind].map((option) => ({
            id: option.value,
            title: option.title,
            image: option.symbol,
            state:
                option.value === tracked?.status
                    ? ('on' as const)
                    : ('off' as const),
        })),
        ...(tracked
            ? [
                  {
                      id: 'settings-section',
                      title: '',
                      displayInline: true,
                      subactions: [
                          {
                              id: SETTINGS,
                              title: 'Налаштування',
                              image: 'gearshape' as const,
                          },
                      ],
                  },
              ]
            : []),
    ];

    const withMenu = (trigger: ReactElement, width: number) => (
        <View style={{ width, height: TRIGGER_HEIGHT }}>
            {blocked ? (
                trigger
            ) : (
                <NativeMenu
                    actions={actions}
                    onAction={handleAction}
                    width={width}
                    height={TRIGGER_HEIGHT}
                >
                    {trigger}
                </NativeMenu>
            )}
        </View>
    );

    if (tracked) {
        const status = findStatus(kind, tracked.status);
        const style = statusStyle(status?.value);

        return (
            <View className={cn('flex-row', className)}>
                <View
                    className="min-h-11 flex-1"
                    onLayout={(event) =>
                        setFillWidth(event.nativeEvent.layout.width)
                    }
                >
                    {fillWidth > 0 &&
                        withMenu(
                            <Segment
                                width={fillWidth}
                                accessibilityLabel={`Список: ${status?.title ?? ADD_LABEL}`}
                                disabled={blocked}
                                className={cn(
                                    'w-full rounded-r-none border border-r-0',
                                    style.surface,
                                )}
                                textClassName={style.text}
                            >
                                {pending ? (
                                    <ActivityIndicator size="small" />
                                ) : (
                                    <View
                                        className={cn(
                                            'rounded-sm border p-1',
                                            style.surface,
                                        )}
                                    >
                                        <StatusIcon
                                            glyph={
                                                status?.glyph ??
                                                STATUS_OPTIONS[kind][0].glyph
                                            }
                                            className="size-3"
                                        />
                                    </View>
                                )}
                                <Text
                                    numberOfLines={1}
                                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                                    className="shrink"
                                >
                                    {status?.title ?? ADD_LABEL}
                                </Text>
                                {tracked.score > 0 && (
                                    <Text
                                        maxFontSizeMultiplier={
                                            DENSE_MAX_FONT_SCALE
                                        }
                                        className="opacity-60"
                                    >
                                        - {tracked.score}
                                    </Text>
                                )}
                            </Segment>,
                            fillWidth,
                        )}
                </View>
                <Button
                    variant="secondary"
                    size="icon-md"
                    accessibilityLabel="Налаштування"
                    disabled={blocked}
                    className={cn(
                        'rounded-l-none border border-l-0',
                        style.surface,
                    )}
                    textClassName={style.text}
                    onPress={() =>
                        router.push(listEntryHref(contentType, slug))
                    }
                >
                    <Icon as={Settings} />
                </Button>
            </View>
        );
    }

    return (
        <View className={cn('flex-row', className)}>
            <Button
                variant="secondary"
                size="md"
                disabled={blocked}
                containerClassName="flex-1"
                className="w-full rounded-r-none"
                onPress={() => changeStatus(PLANNED_STATUS[kind])}
            >
                {blocked ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <View className="rounded-sm border border-secondary-foreground/20 p-1">
                        <StatusIcon
                            glyph={STATUS_OPTIONS[kind][0].glyph}
                            className="size-3"
                        />
                    </View>
                )}
                {ADD_LABEL}
            </Button>
            {withMenu(
                <Segment
                    width={CHEVRON_WIDTH}
                    accessibilityLabel="Вибрати список"
                    disabled={blocked}
                    className="size-10 rounded-l-none px-0"
                >
                    <Icon as={ChevronDown} />
                </Segment>,
                CHEVRON_WIDTH,
            )}
        </View>
    );
};

export default ListStatusButton;
