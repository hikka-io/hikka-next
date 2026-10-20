import { type FC, useRef, useState } from 'react';

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { AtSign, EyeOff, Star } from 'lucide-react-native';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    API_LIMITS,
    type CommentContentTypeEnum,
    type CommentResponse,
} from '@hikka/api';
import {
    canToggleReview,
    commentReplyTarget,
    commentTextLength,
    type MentionUser,
    normalizeCommentText,
    parseCommentMentions,
    REVIEW_VERDICT_OPTIONS,
    serializeCommentMentions,
    toReviewArgs,
    type Verdict,
} from '@hikka/core';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { useSession } from '@/features/auth';
import { cn } from '@/utils/cn';
import { SITE_ORIGIN } from '@/utils/site-origin';

import { useCommentTreeStore } from './comment-tree-store';
import {
    activeMentionQuery,
    caretAfterChange,
    type Edit,
    insertMention,
    insertSpoiler,
    type MentionQuery,
    type Selection,
    startMention,
} from './composer-text';
import MentionPicker from './mention-picker';
import { VERDICT_ICONS } from './review-verdicts';
import { useCachedComment } from './use-cached-comment';
import { useEditComment, useWriteComment } from './use-comment-mutations';
import { useKeyboardInset } from './use-keyboard-inset';

const MAX_LENGTH = API_LIMITS.commentText.max;

const VERDICT_SELECTED: Record<Verdict, string> = {
    yes: 'border border-success-border bg-success',
    maybe: 'border border-warning-border bg-warning',
    no: 'border border-destructive-border bg-destructive',
};

const VERDICT_TEXT: Record<Verdict, string> = {
    yes: 'text-success-foreground',
    maybe: 'text-warning-foreground',
    no: 'text-destructive-foreground',
};

type Target = {
    contentType: CommentContentTypeEnum;
    slug: string;
    reply?: string;
    edit?: string;
    review?: boolean;
};

type FormProps = Target & {
    comment: CommentResponse | null;
};

const ComposerForm: FC<FormProps> = ({
    contentType,
    slug,
    edit,
    review,
    comment,
}) => {
    const router = useRouter();
    const setExpanded = useCommentTreeStore((state) => state.setExpanded);
    const { ref, inset } = useKeyboardInset();
    const { bottom } = useSafeAreaInsets();

    const isEdit = !!edit && !!comment;
    const replyTo = !isEdit ? comment : null;
    const replyTarget = replyTo ? commentReplyTarget(replyTo) : undefined;
    const prefix = replyTarget?.mention ?? '';

    const [initial] = useState(() =>
        isEdit
            ? parseCommentMentions(comment.text ?? '')
            : { text: '', mentions: [] as MentionUser[] },
    );
    const [text, setText] = useState(initial.text);
    const [mentions, setMentions] = useState<MentionUser[]>(initial.mentions);
    // Refs, not state: a re-render from a selection event lands before the text change on
    // iOS and puts the caret back where it was before a paste. Only a changed mention re-renders.
    const selection = useRef<Selection>({
        start: initial.text.length,
        end: initial.text.length,
    });
    const latestText = useRef(initial.text);
    const [mention, setMention] = useState<MentionQuery | null>(null);
    const syncMention = () => {
        const next = activeMentionQuery(latestText.current, selection.current);
        setMention((prev) =>
            prev?.start === next?.start && prev?.query === next?.query
                ? prev
                : next,
        );
    };
    const [forcedSelection, setForcedSelection] = useState<Selection>();

    const isExistingReview = isEdit && !!comment.review;
    const showReviewToggle = canToggleReview({
        contentType,
        isReply: !!replyTo,
        parent: isEdit ? comment.parent : null,
        isExistingReview,
    });
    const [isReview, setIsReview] = useState(
        isExistingReview || (!!review && showReviewToggle),
    );
    const [verdict, setVerdict] = useState<Verdict | null>(
        comment?.review?.recommended ?? null,
    );

    const close = () => router.back();
    const onSaved = () => {
        if (replyTo) {
            setExpanded(replyTo.reference, true);
            if (replyTarget) setExpanded(replyTarget.parent, true);
        }
        close();
    };
    const write = useWriteComment(onSaved);
    const save = useEditComment(onSaved);
    const pending = write.isPending || save.isPending;

    const body = normalizeCommentText(
        serializeCommentMentions(text, mentions, SITE_ORIGIN),
    );
    const length = commentTextLength(prefix) + commentTextLength(body);
    const tooLong = length > MAX_LENGTH;
    const reviewArgs = toReviewArgs(isReview, verdict);
    // The backend keeps a history entry for every edit, so an unchanged save is not sent.
    const unchanged =
        isEdit &&
        body === normalizeCommentText(comment.text ?? '') &&
        (reviewArgs?.recommended ?? null) ===
            (comment.review?.recommended ?? null);
    const canSend =
        body !== '' &&
        !tooLong &&
        !(isReview && !verdict) &&
        !unchanged &&
        !pending;
    // `isPending` only flips on the next render, so a second tap in the same frame would send twice.
    const submitting = useRef(false);
    const release = {
        onError: () => {
            submitting.current = false;
        },
    };

    const apply = ({ text: next, selection: caret }: Edit) => {
        setText(next);
        latestText.current = next;
        selection.current = caret;
        setForcedSelection(caret);
        syncMention();
    };

    const submit = () => {
        if (!canSend || submitting.current) return;
        submitting.current = true;

        if (isEdit) {
            save.mutate(
                {
                    path: { comment_reference: comment.reference },
                    body: { text: body, review: reviewArgs },
                },
                release,
            );
            return;
        }

        write.mutate(
            {
                path: { content_type: contentType, slug },
                body: {
                    parent: replyTarget?.parent,
                    text: `${prefix}${body}`,
                    review: reviewArgs,
                },
            },
            release,
        );
    };

    const title = isEdit
        ? 'Редагування'
        : replyTo
          ? 'Відповідь'
          : isReview
            ? 'Відгук'
            : 'Коментар';
    const placeholder = replyTo
        ? `Відповідь для ${replyTo.author.username ?? 'користувача'}...`
        : isReview
          ? 'Поділіться враженнями від тайтлу...'
          : 'Напишіть повідомлення...';

    return (
        <View
            ref={ref}
            className="flex-1 bg-background"
            style={{ paddingBottom: Math.max(inset, bottom) }}
        >
            <View className="flex-row items-center justify-between gap-2 px-2 pt-3 pb-1">
                <Button variant="ghost" size="md" onPress={close}>
                    Скасувати
                </Button>
                <Text
                    accessibilityRole="header"
                    numberOfLines={1}
                    className="shrink font-semibold text-base"
                >
                    {title}
                </Text>
                <Button size="md" disabled={!canSend} onPress={submit}>
                    {pending ? (
                        <Spinner size="small" />
                    ) : isEdit ? (
                        'Зберегти'
                    ) : (
                        'Надіслати'
                    )}
                </Button>
            </View>

            {isReview && (
                <View className="flex-row flex-wrap gap-x-2 px-4">
                    {REVIEW_VERDICT_OPTIONS.map((option) => {
                        const selected = verdict === option.value;

                        return (
                            <Chip
                                key={option.value}
                                selected={selected}
                                accessibilityState={{ selected }}
                                className={
                                    selected
                                        ? VERDICT_SELECTED[option.value]
                                        : 'bg-secondary'
                                }
                                textClassName={
                                    selected
                                        ? VERDICT_TEXT[option.value]
                                        : undefined
                                }
                                onPress={() => {
                                    void Haptics.selectionAsync();
                                    setVerdict(selected ? null : option.value);
                                }}
                            >
                                <Icon as={VERDICT_ICONS[option.value]} />
                                {option.label}
                            </Chip>
                        );
                    })}
                </View>
            )}

            <TextInput
                multiline
                autoFocus
                editable={!pending}
                value={text}
                selection={forcedSelection}
                placeholder={placeholder}
                placeholderTextColorClassName="accent-muted-foreground"
                textAlignVertical="top"
                scrollEnabled
                onChangeText={(next) => {
                    const prev = latestText.current;
                    setText(next);
                    latestText.current = next;
                    // A paste or an autocorrection can leave the native caret where it was before it.
                    if (Math.abs(next.length - prev.length) > 1) {
                        const position = caretAfterChange(prev, next);
                        selection.current = { start: position, end: position };
                        setForcedSelection(selection.current);
                    }
                    syncMention();
                }}
                onSelectionChange={(event) => {
                    selection.current = event.nativeEvent.selection;
                    setForcedSelection(undefined);
                    syncMention();
                }}
                accessibilityLabel={title}
                className="flex-1 px-4 py-3 text-base text-foreground leading-6"
            />

            {mention && (
                <MentionPicker
                    query={mention.query}
                    onPick={(user) => {
                        apply(
                            insertMention(
                                text,
                                mention,
                                selection.current.start,
                                user.username,
                            ),
                        );
                        setMentions((prev) =>
                            prev.some((item) => item.username === user.username)
                                ? prev
                                : [
                                      ...prev,
                                      {
                                          username: user.username,
                                          reference: user.reference,
                                      },
                                  ],
                        );
                    }}
                />
            )}

            <View className="flex-row items-center gap-1 border-border border-t px-2">
                <Button
                    variant="ghost"
                    size="icon-md"
                    accessibilityLabel="Згадати користувача"
                    onPress={() => apply(startMention(text, selection.current))}
                >
                    <Icon as={AtSign} className="size-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon-md"
                    accessibilityLabel="Спойлер"
                    onPress={() =>
                        apply(insertSpoiler(text, selection.current))
                    }
                >
                    <Icon as={EyeOff} className="size-5" />
                </Button>
                {showReviewToggle && (
                    <Chip
                        selected={isReview}
                        accessibilityState={{ selected: isReview }}
                        className={isReview ? undefined : 'bg-secondary'}
                        onPress={() => {
                            void Haptics.selectionAsync();
                            setIsReview(!isReview);
                            if (isReview) setVerdict(null);
                        }}
                    >
                        <Icon as={Star} />
                        Відгук
                    </Chip>
                )}
                <Text
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    accessibilityLabel={`${length} з ${MAX_LENGTH} символів`}
                    className={cn(
                        'ml-auto px-2 text-xs tabular-nums',
                        tooLong
                            ? 'text-destructive-foreground'
                            : 'text-muted-foreground',
                    )}
                >
                    {length}/{MAX_LENGTH}
                </Text>
            </View>
        </View>
    );
};

const Message: FC<{ text: string; action: string; onPress: () => void }> = ({
    text,
    action,
    onPress,
}) => (
    <View className="flex-1 items-center gap-3 bg-background px-4 py-10">
        <Text className="text-center text-muted-foreground text-sm">
            {text}
        </Text>
        <Button variant="secondary" size="md" onPress={onPress}>
            {action}
        </Button>
    </View>
);

/** The web's `CommentInput` as a native sheet: a plain markdown field with mentions and spoilers. */
const CommentComposer: FC<Target> = (props) => {
    const router = useRouter();
    const { hasToken } = useSession();
    const reference = props.edit ?? props.reply;
    const comment = useCachedComment(reference);

    if (!hasToken) {
        return (
            <Message
                text="Увійдіть у свій акаунт, щоб залишити коментар"
                action="Увійти"
                onPress={() => router.replace('/login')}
            />
        );
    }

    if (reference && !comment) {
        return (
            <Message
                text="Коментар не знайдено."
                action="Закрити"
                onPress={() => router.back()}
            />
        );
    }

    return <ComposerForm {...props} comment={comment} />;
};

export default CommentComposer;
