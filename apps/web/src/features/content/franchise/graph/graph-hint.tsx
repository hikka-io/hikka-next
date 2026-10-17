import type { FC } from 'react';

import { Move, Pointer } from 'lucide-react';

import { Button } from '@/components/ui/button';

const TIPS = [
    { icon: Pointer, text: 'Торкніться постера, щоб побачити зв’язки' },
    { icon: Move, text: 'Тягніть і масштабуйте щипком' },
];

type Props = {
    onDismiss: () => void;
};

const GraphHint: FC<Props> = ({ onDismiss }) => (
    <section
        aria-label="Підказки"
        className="pointer-events-auto mx-3 mb-[calc(--spacing(6)+var(--safe-area-bottom))] flex w-[calc(100%-1.5rem)] flex-col gap-3.5 rounded-xl border bg-popover p-4 text-popover-foreground text-sm shadow-md"
    >
        {TIPS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="size-4" />
                </span>
                {text}
            </div>
        ))}
        <Button size="md" onClick={onDismiss}>
            Зрозуміло
        </Button>
    </section>
);

export default GraphHint;
