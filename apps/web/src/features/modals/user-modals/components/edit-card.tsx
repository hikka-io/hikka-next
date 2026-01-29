'use client';

import { EditResponse, EditStatusEnum } from '@hikka/client';
import { format } from 'date-fns';

import MaterialSymbolsCheckRounded from '@/components/icons/material-symbols/MaterialSymbolsCheckRounded';
import MaterialSymbolsCloseRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseRounded';
import MaterialSymbolsHourglassEmptyRounded from '@/components/icons/material-symbols/MaterialSymbolsHourglassEmptyRounded';
import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import Closed from '@/components/icons/watch-status/dropped';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { cn } from '@/utils/cn';
import { EDIT_PARAMS, EDIT_STATUS } from '@/utils/constants/edit';

interface Props {
    edit: EditResponse;
    className?: string;
    href: string;
}

const Component = ({ edit, href, className, ...props }: Props) => {
    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <HorizontalCard href={`/u/${edit.author?.username}`}>
                <HorizontalCardImage
                    className="w-10"
                    image={edit.author?.avatar}
                    imageRatio={1}
                />
                <HorizontalCardContainer className="shrink-0">
                    <HorizontalCardTitle>
                        {edit.author?.username}
                    </HorizontalCardTitle>
                    <HorizontalCardDescription>
                        {format(edit.created * 1000, 'd MMM yyyy H:mm')}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
                <Button
                    size="md"
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
                    <span className="hidden md:block">
                        {EDIT_STATUS[edit.status].title_ua}
                    </span>
                </Button>
            </HorizontalCard>
            <div className="flex flex-wrap gap-2 border-l-2 pl-4">
                {Object.keys(edit.after).map(
                    (key) =>
                        key !== 'title' && (
                            <Badge variant="outline" key={key}>
                                {EDIT_PARAMS[key as keyof typeof EDIT_PARAMS]}
                            </Badge>
                        ),
                )}
            </div>
        </div>
    );
};

export default Component;
