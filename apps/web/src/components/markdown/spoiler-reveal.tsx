import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type Props = {
    children: ReactNode;
    className?: string;
    /**
     * When false, renders the hidden state as static decoration (no reveal
     * button) — for previews wrapped in a link, where the click navigates
     * to the full view instead of revealing in place.
     */
    interactive?: boolean;
};

const CLAMP_PX = 88;

const SpoilerPill = () => (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 font-medium text-white text-xs backdrop-blur-sm">
        <Eye className="size-3.5" />
        Спойлер
    </span>
);

const SpoilerReveal: FC<Props> = ({
    children,
    className,
    interactive = true,
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [revealed, setRevealed] = useState(false);

    const hidden = !interactive || !revealed;

    return (
        <div
            className={cn(
                'spoiler surface-inset relative isolate w-full rounded-(--base-radius) border border-border p-2',
                className,
            )}
        >
            <div
                className={cn(
                    'overflow-hidden',
                    hidden && 'pointer-events-none select-none blur-sm',
                )}
                style={{ maxHeight: hidden ? CLAMP_PX : undefined }}
            >
                <div ref={contentRef} aria-hidden={hidden}>
                    {children}
                </div>
            </div>

            {hidden &&
                (interactive ? (
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            setRevealed(true);
                        }}
                        aria-label="Показати спойлер"
                        className="absolute inset-0 z-20 flex items-center justify-center rounded-(--base-radius)"
                    >
                        <SpoilerPill />
                    </button>
                ) : (
                    <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                        <SpoilerPill />
                    </span>
                ))}
            {!hidden && (
                <div className="relative z-20 flex w-full items-center justify-start pt-2">
                    <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 font-medium text-muted-foreground text-sm hover:text-foreground"
                        onClick={(event) => {
                            event.stopPropagation();
                            setRevealed(false);
                        }}
                    >
                        Приховати спойлер
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SpoilerReveal;
