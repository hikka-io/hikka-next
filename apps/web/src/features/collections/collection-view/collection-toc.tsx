import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getCollectionOptions } from '@hikka/api';

import Card from '@/components/ui/card';
import TextLink from '@/components/ui/text-link';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

type Props = {
    className?: string;
};

function CollectionToc({ className }: Props) {
    const params = useParams();
    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference: String(params.reference) } }),
    );
    const tocScrollRef = useRef<HTMLUListElement>(null);
    const pinnedRef = useRef<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const { gradientClassName } = useScrollGradientMask(tocScrollRef);
    const labels = collection?.labels_order;

    useEffect(() => {
        if (!labels?.length) return;

        let frame = 0;

        // The last group whose top has reached the line a TOC jump lands it on: the page's scroll padding plus its own scroll margin.
        const update = () => {
            frame = 0;
            if (pinnedRef.current) return;

            const padding =
                Number.parseFloat(
                    getComputedStyle(document.documentElement).scrollPaddingTop,
                ) || 0;
            let current = labels[0];
            for (const label of labels) {
                const heading = document.getElementById(label);
                if (!heading) continue;

                const margin =
                    Number.parseFloat(
                        getComputedStyle(heading).scrollMarginTop,
                    ) || 0;
                if (
                    heading.getBoundingClientRect().top >
                    padding + margin + 1
                ) {
                    break;
                }
                current = label;
            }
            setActiveId(current);
        };

        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        // A clicked group stays active through its jump, even when the page cannot scroll it to the top.
        const unpin = () => {
            pinnedRef.current = null;
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        for (const type of ['wheel', 'pointerdown', 'keydown'] as const) {
            window.addEventListener(type, unpin, { passive: true });
        }

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            for (const type of ['wheel', 'pointerdown', 'keydown'] as const) {
                window.removeEventListener(type, unpin);
            }
        };
    }, [labels]);

    if (collection?.labels_order.length === 0) return null;

    return (
        <Card className={cn(className)}>
            <h2 className="font-bold text-base">Зміст</h2>

            <ul
                ref={tocScrollRef}
                className={cn(
                    '-m-4 space-y-2.5 overflow-y-auto p-4 text-sm',
                    gradientClassName,
                )}
            >
                {collection?.labels_order.map((label, index) => {
                    return (
                        <li key={`${index}-${label}`}>
                            <TextLink
                                to={`#${label}`}
                                onClick={() => {
                                    pinnedRef.current = label;
                                    setActiveId(label);
                                }}
                                className={cn(
                                    'line-clamp-2 text-muted-foreground',
                                    activeId === label &&
                                        'font-medium text-foreground',
                                )}
                            >
                                {label}
                            </TextLink>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}

export default CollectionToc;
