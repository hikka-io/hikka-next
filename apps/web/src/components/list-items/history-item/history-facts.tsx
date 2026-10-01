import { type FC, Fragment, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

import type { HistoryFact, HistoryFactPart } from './types';

type Props = {
    facts: HistoryFact[];
    lead?: ReactNode;
    className?: string;
};

const FACT =
    "relative min-w-0 pl-5 before:absolute before:top-[calc(0.5lh-2px)] before:left-2 before:size-1 before:rounded-full before:bg-muted-foreground before:content-['']";

const PART_CLASSES: Record<HistoryFactPart['type'], string | undefined> = {
    text: undefined,
    value: 'font-semibold text-foreground',
    status: 'font-medium text-foreground',
};

const HistoryFacts: FC<Props> = ({ facts, lead, className }) => (
    <div
        className={cn(
            'overflow-hidden text-muted-foreground text-xs',
            className,
        )}
    >
        <div className="-ml-5 flex flex-wrap">
            {lead && <span className={FACT}>{lead}</span>}
            {facts.map((item) => (
                <span
                    key={item.map((part) => part.text).join('')}
                    className={FACT}
                >
                    {item.map((part) => (
                        <Fragment key={`${part.type}:${part.text}`}>
                            {PART_CLASSES[part.type] ? (
                                <span className={PART_CLASSES[part.type]}>
                                    {part.text}
                                </span>
                            ) : (
                                part.text
                            )}
                        </Fragment>
                    ))}
                </span>
            ))}
        </div>
    </div>
);

export default HistoryFacts;
