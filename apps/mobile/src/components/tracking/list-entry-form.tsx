import { type FC, useRef, useState } from 'react';

import * as Haptics from 'expo-haptics';
import { ChevronsUpDown, Trash2 } from 'lucide-react-native';
import { ActivityIndicator, Alert, TextInput, View } from 'react-native';
import { toast } from 'sonner-native';

import {
    API_LIMITS,
    ContentTypeEnum,
    type MainContentTypeEnum,
} from '@hikka/api';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';

import DateField from './date-field';
import type { ContentInfo } from './list-entry-options';
import NativeMenu from './native-menu';
import ProgressStepper from './progress-stepper';
import { findStatus, STATUS_OPTIONS, statusStyle } from './status-config';
import StatusIcon from './status-icon';
import {
    buildEditBody,
    draftFromEntry,
    type EntryDraft,
    episodesMax,
    kindOf,
    type ListEntry,
} from './tracking-body';
import {
    useDeleteListEntry,
    useSaveListEntry,
    useSavePending,
} from './use-tracking-mutations';

type Props = {
    contentType: MainContentTypeEnum;
    slug: string;
    title: string;
    /** `null`: not in the list yet, the save creates the entry. */
    entry: ListEntry | null;
    content: ContentInfo;
    onClose: () => void;
};

const PROGRESS_MAX = API_LIMITS.listProgress.max;
const ROW_HEIGHT = 44;

/** The web's watch/read edit forms. Every save sends the whole draft: the PUT is full-replace. */
const ListEntryForm: FC<Props> = ({
    contentType,
    slug,
    title,
    entry,
    content,
    onClose,
}) => {
    const getTitle = useTitle();
    const kind = kindOf(contentType);
    const [draft, setDraft] = useState<EntryDraft>(() =>
        draftFromEntry(kind, entry),
    );
    // Idempotency: the same draft is never sent twice (a double tap before `isPending` renders).
    const sentRef = useRef<EntryDraft | null>(null);
    const [rowWidth, setRowWidth] = useState(0);

    const save = useSaveListEntry({
        onSuccess: (data) => {
            toast.success(
                `${getTitle('anime' in data ? data.anime : data.content)} успішно оновлено.`,
            );
            onClose();
        },
    });
    const remove = useDeleteListEntry({
        onSuccess: () => {
            toast.success(
                contentType === ContentTypeEnum.ANIME
                    ? 'Аніме успішно видалено.'
                    : 'Контент успішно видалено.',
            );
            onClose();
        },
    });
    // A deleted entry stays deleted until the sheet closes: no save may re-create it.
    // Any write for this title (another control included) freezes the draft until it lands.
    const busy =
        useSavePending(slug) ||
        save.isPending ||
        remove.isPending ||
        remove.isSuccess;

    const update = (patch: Partial<EntryDraft>) =>
        setDraft((current) => ({ ...current, ...patch }));

    const handleSave = () => {
        if (busy || sentRef.current === draft) return;
        sentRef.current = draft;
        save.mutate(
            { contentType, slug, body: buildEditBody(kind, draft) },
            {
                onError: () => {
                    sentRef.current = null;
                },
            },
        );
    };

    const handleDelete = () => {
        void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning,
        );
        Alert.alert(
            'Видалити зі списку?',
            `${title} буде видалено з вашого списку разом з оцінкою та нотатками.`,
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Видалити',
                    style: 'destructive',
                    onPress: () => remove.mutate({ contentType, slug }),
                },
            ],
        );
    };

    const status = findStatus(kind, draft.status);
    const style = statusStyle(status?.value);
    const repeatsLabel =
        kind === 'watch' ? 'Повторні перегляди' : 'Повторні читання';
    const readTotals = 'chapters' in content ? content : undefined;
    const animeTotal =
        'episodes_total' in content ? content.episodes_total : undefined;

    return (
        <View className="gap-4">
            <Card className="gap-0 py-1">
                <View
                    style={{ height: ROW_HEIGHT }}
                    onLayout={(event) =>
                        setRowWidth(event.nativeEvent.layout.width)
                    }
                >
                    {rowWidth > 0 && (
                        <NativeMenu
                            title="Список"
                            width={rowWidth}
                            height={ROW_HEIGHT}
                            actions={STATUS_OPTIONS[kind].map((option) => ({
                                id: option.value,
                                title: option.title,
                                image: option.symbol,
                                state:
                                    option.value === draft.status
                                        ? ('on' as const)
                                        : 'off',
                            }))}
                            onAction={(id) => {
                                void Haptics.selectionAsync();
                                update({ status: id });
                            }}
                            accessibilityLabel={`Список: ${status?.title ?? ''}`}
                        >
                            <View className="h-11 flex-row items-center gap-2">
                                <Text className="flex-1 text-base">Список</Text>
                                <View
                                    className={cn(
                                        'flex-row items-center gap-2 rounded-md border px-2 py-1',
                                        style.surface,
                                    )}
                                >
                                    <StatusIcon
                                        glyph={
                                            status?.glyph ??
                                            STATUS_OPTIONS[kind][0].glyph
                                        }
                                        className={cn('size-3', style.text)}
                                    />
                                    <Text
                                        maxFontSizeMultiplier={
                                            DENSE_MAX_FONT_SCALE
                                        }
                                        className={cn(
                                            'font-medium text-sm',
                                            style.text,
                                        )}
                                    >
                                        {status?.title}
                                    </Text>
                                </View>
                                <Icon
                                    as={ChevronsUpDown}
                                    className="text-muted-foreground"
                                />
                            </View>
                        </NativeMenu>
                    )}
                </View>
                <Separator />
                {kind === 'watch' ? (
                    <ProgressStepper
                        label="Епізоди"
                        value={draft.episodes}
                        max={episodesMax({ episodes_total: animeTotal })}
                        total={animeTotal}
                        onChange={(episodes) => update({ episodes })}
                        disabled={busy}
                    />
                ) : (
                    <>
                        <ProgressStepper
                            label="Розділи"
                            value={draft.chapters}
                            max={PROGRESS_MAX}
                            total={readTotals?.chapters}
                            onChange={(chapters) => update({ chapters })}
                            disabled={busy}
                        />
                        <Separator />
                        <ProgressStepper
                            label="Томи"
                            value={draft.volumes}
                            max={PROGRESS_MAX}
                            total={readTotals?.volumes}
                            onChange={(volumes) => update({ volumes })}
                            disabled={busy}
                        />
                    </>
                )}
                <Separator />
                <ProgressStepper
                    label="Оцінка"
                    value={draft.score}
                    max={API_LIMITS.listScore.max}
                    onChange={(score) => update({ score })}
                    disabled={busy}
                />
                <Separator />
                <ProgressStepper
                    label={repeatsLabel}
                    value={draft.repeats}
                    max={API_LIMITS.listRepeats.max}
                    onChange={(repeats) => update({ repeats })}
                    disabled={busy}
                />
            </Card>

            <Card className="gap-0 py-1">
                <DateField
                    label="Дата початку"
                    value={draft.start_date}
                    max={draft.end_date}
                    onChange={(start_date) => update({ start_date })}
                    disabled={busy}
                />
                <Separator />
                <DateField
                    label="Дата завершення"
                    value={draft.end_date}
                    min={draft.start_date}
                    onChange={(end_date) => update({ end_date })}
                    disabled={busy}
                />
            </Card>

            <View className="gap-1.5">
                <View className="flex-row items-baseline justify-between">
                    <Text className="font-medium text-sm">Нотатки</Text>
                    <Text
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="text-muted-foreground text-xs"
                    >
                        {draft.note.length}/{API_LIMITS.listNote.max}
                    </Text>
                </View>
                <TextInput
                    multiline
                    editable={!busy}
                    placeholder="Залиште нотатку"
                    placeholderTextColorClassName="accent-muted-foreground"
                    maxLength={API_LIMITS.listNote.max}
                    value={draft.note}
                    onChangeText={(note) => update({ note })}
                    textAlignVertical="top"
                    className="min-h-24 rounded-lg border border-border bg-secondary/20 px-3 py-2.5 text-base text-foreground"
                />
            </View>

            <View className="flex-row gap-2">
                {entry && (
                    <Button
                        variant="destructive"
                        size="md"
                        disabled={busy}
                        onPress={handleDelete}
                    >
                        {remove.isPending ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <Icon as={Trash2} />
                        )}
                        Видалити
                    </Button>
                )}
                <Button
                    size="md"
                    disabled={busy}
                    containerClassName="flex-1"
                    className="w-full"
                    onPress={handleSave}
                >
                    {save.isPending && <ActivityIndicator size="small" />}
                    Зберегти
                </Button>
            </View>
        </View>
    );
};

export default ListEntryForm;
