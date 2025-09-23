'use client';

import { EditResponse, EditStatusEnum } from '@hikka/client';
import { format } from 'date-fns';
import Link from 'next/link';

import MaterialSymbolsCheckRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckRounded';
import MaterialSymbolsCloseRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseRounded';
import MaterialSymbolsHourglassEmptyRounded from '@/components/icons/material-symbols/MaterialSymbolsHourglassEmptyRounded';
import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import Closed from '@/components/icons/watch-status/dropped';

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

            <Button
                asChild
                size="icon-md"
                variant={
                    edit.status === EditStatusEnum.ACCEPTED
                        ? 'success'
                        : edit.status === EditStatusEnum.DENIED
                            ? 'destructive'
                            : edit.status === EditStatusEnum.CLOSED
                                ? 'outline'
                                : 'warning'
                }
            >
                <Link href={href}>
                    {edit.status === EditStatusEnum.ACCEPTED ? (
                        <MaterialSymbolsCheckRounded />
                    ) : edit.status === EditStatusEnum.DENIED ? (
                        <MaterialSymbolsCloseRounded />
                    ) : edit.status === EditStatusEnum.CLOSED ? (
                        <Closed />
                    ) : edit.status === EditStatusEnum.PENDING ? (
                        <MaterialSymbolsHourglassEmptyRounded />
                    ) : (
                        <MaterialSymbolsVisibilityOutlineRounded />
                    )}
                </Link>
            </Button>
        </HorizontalCard>
    );
};

export default Component;
