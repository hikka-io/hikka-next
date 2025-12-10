'use client';

import { useCollectionByReference } from '@hikka/react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from '@/components/ui/link';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

function TableOfContents({ className }: Props) {
    const params = useParams();
    const { data: collection } = useCollectionByReference({
        reference: String(params.reference),
    });
    const scrollRef = useRef(0);
    const tocScrollRef = useRef<HTMLUListElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const { gradientClassName } = useScrollGradientMask(tocScrollRef);

    useEffect(() => {
        const headingsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.getAttribute('id');

                    if (entry.isIntersecting) {
                        setActiveId(id);
                        scrollRef.current = window.scrollY;
                    } else {
                        const diff = scrollRef.current - window.scrollY;
                        const isScrollingUp = diff > 0;
                        const currentIndex = collection?.labels_order.findIndex(
                            (heading) => heading === id,
                        );
                        const prevEntry =
                            collection?.labels_order[currentIndex! - 1];
                        const prevId = prevEntry;

                        if (isScrollingUp && prevId) {
                            setActiveId(prevId);
                        }
                    }
                });
            },
            {
                rootMargin: '0px 0px -90% 0px',
            },
        );

        const observeHeadings = () => {
            collection?.labels_order.forEach((heading) => {
                const currentHeading = document.getElementById(heading);

                if (currentHeading) {
                    headingsObserver.observe(currentHeading);
                }
            });
        };

        if (collection?.labels_order.length) {
            observeHeadings();
        }

        return () => {
            collection?.labels_order.forEach((heading) => {
                const currentHeading = document.getElementById(heading);

                if (currentHeading) {
                    headingsObserver.unobserve(currentHeading);
                }
            });
        };
    }, [collection?.labels_order]);

    if (collection?.labels_order.length === 0) return null;

    return (
        <Card className={cn(className)}>
            <Label>Зміст</Label>

            <ul
                ref={tocScrollRef}
                className={cn(
                    '-m-4 space-y-2.5 overflow-y-auto p-4 text-sm',
                    'styled-scrollbar',
                    gradientClassName,
                )}
            >
                {collection?.labels_order.map((label, index) => {
                    return (
                        <li key={`${index}-${label}`}>
                            <Link
                                href={`#${label}`}
                                className={cn(
                                    'line-clamp-2 text-muted-foreground',
                                    activeId === label &&
                                        'font-medium text-foreground',
                                )}
                            >
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}

export default TableOfContents;
