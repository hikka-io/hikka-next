import type { FC } from 'react';

import { cn } from '@/utils/cn';

import type { HistoryFact, HistoryFactPart } from './types';

type Props = {
    facts: HistoryFact[];
    className?: string;
};

const PART_CLASSES: Record<Exclude<HistoryFactPart['type'], 'text'>, string> = {
    value: 'font-semibold text-foreground',
    status: 'font-medium text-foreground',
};

const factKey = (fact: HistoryFact) => fact.map((part) => part.text).join('');

// Each fact draws its dot in its own left padding; the wrapper hides the dots that would start a line.
const HistoryFacts: FC<Props> = ({ facts, className }) => (
    <div
        className={cn(
            'overflow-hidden text-muted-foreground text-xs',
            className,
        )}
    >
        <div className="-ml-5 flex flex-wrap">
            {facts.map((fact) => (
                <span
                    key={factKey(fact)}
                    className="relative min-w-0 pl-5 before:absolute before:top-[calc(0.5lh-2px)] before:left-2 before:size-1 before:rounded-full before:bg-muted-foreground before:content-['']"
                >
                    {fact.map((part) =>
                        part.type === 'text' ? (
                            part.text
                        ) : (
                            <span
                                key={`${part.type}:${part.text}`}
                                className={PART_CLASSES[part.type]}
                            >
                                {part.text}
                            </span>
                        ),
                    )}
                </span>
            ))}
        </div>
    </div>
);

export default HistoryFacts;
