import type { FC } from 'react';

import {
    type LucideIcon,
    Meh,
    Star,
    ThumbsDown,
    ThumbsUp,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/utils/cn';

import type { Verdict } from './utils/review';

const OPTIONS: {
    value: Verdict;
    label: string;
    icon: LucideIcon;
    on: string;
}[] = [
    {
        value: 'yes',
        label: 'Рекомендує',
        icon: ThumbsUp,
        on: 'data-[state=on]:border-success-foreground/40 data-[state=on]:bg-success-foreground/15 data-[state=on]:text-success-foreground',
    },
    {
        value: 'maybe',
        label: 'Вагається',
        icon: Meh,
        on: 'data-[state=on]:border-warning-foreground/40 data-[state=on]:bg-warning-foreground/15 data-[state=on]:text-warning-foreground',
    },
    {
        value: 'no',
        label: 'Не рекомендує',
        icon: ThumbsDown,
        on: 'data-[state=on]:border-destructive-foreground/40 data-[state=on]:bg-destructive-foreground/15 data-[state=on]:text-destructive-foreground',
    },
];

type Props = {
    value: Verdict | null;
    onChange: (value: Verdict | null) => void;
    onDismiss: () => void;
    className?: string;
};

const CommentVerdictPicker: FC<Props> = ({
    value,
    onChange,
    onDismiss,
    className,
}) => {
    return (
        <div
            className={cn(
                'flex flex-col gap-3 border-border border-t bg-feed-review/5 px-4 py-3',
                className,
            )}
        >
            <div className="flex items-center gap-2">
                <Star className="size-4 text-feed-review" />
                <span className="font-medium text-sm">Ваш вердикт</span>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="ml-auto"
                    onClick={onDismiss}
                    aria-label="Скасувати відгук"
                >
                    <X />
                </Button>
            </div>
            <ToggleGroup
                type="single"
                variant="outline"
                value={value ?? ''}
                onValueChange={(next) =>
                    onChange((next || null) as Verdict | null)
                }
                className="grid grid-cols-3 gap-2 bg-transparent p-0"
            >
                {OPTIONS.map(({ value: v, label, icon: Icon, on }) => (
                    <ToggleGroupItem
                        key={v}
                        value={v}
                        className={cn('h-11 border border-border', on)}
                    >
                        <Icon />
                        {label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
};

export default CommentVerdictPicker;
