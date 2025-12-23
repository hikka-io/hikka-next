import { EditContentType } from '@hikka/client';
import { FC } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { EditListModal } from '@/features/modals';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/cn';

import MaterialSymbolsEditRounded from './icons/material-symbols/MaterialSymbolsEditRounded';

interface Props extends ButtonProps {
    slug: string;
    content_type: EditContentType;
    className?: string;
}

const EditButton: FC<Props> = ({ className, slug, content_type, ...props }) => {
    const { openModal } = useModalContext();

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-md"
                    onClick={() =>
                        openModal({
                            content: (
                                <EditListModal
                                    content_type={content_type}
                                    slug={slug}
                                />
                            ),
                            type: 'sheet',
                            title: 'Список правок',
                        })
                    }
                    className={cn(className)}
                    {...props}
                >
                    <MaterialSymbolsEditRounded className="!size-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Правки</TooltipContent>
        </Tooltip>
    );
};

export default EditButton;
