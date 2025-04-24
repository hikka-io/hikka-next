'use client';

import { EditResponse } from '@hikka/client';
import { format } from 'date-fns';
import Link from 'next/link';

import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import { Button } from '@/components/ui/button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props {
    edit: EditResponse;
    className?: string;
    href: string;
}

const Component = ({ edit, href, className, ...props }: Props) => {
    return (
        <HorizontalCard
            href={`/u/${edit.author?.username}`}
            className={className}
        >
            <HorizontalCardImage image={edit.author?.avatar} imageRatio={1} />
            <HorizontalCardContainer>
                <HorizontalCardTitle>
                    {edit.author?.username}
                </HorizontalCardTitle>
                <HorizontalCardDescription>
                    {format(edit.created * 1000, 'd MMM yyyy H:mm')}
                </HorizontalCardDescription>
            </HorizontalCardContainer>
            <Button asChild size="icon-md" variant="outline">
                <Link href={href}>
                    <MaterialSymbolsVisibilityOutlineRounded />
                </Link>
            </Button>
        </HorizontalCard>
    );
};

export default Component;
