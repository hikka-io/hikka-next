import { EditContentType } from '@hikka/client';
import { FC } from 'react';

import EditListModal from '@/features/modals/edit-modals/editlist-modal/editlist-modal';

import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import MaterialSymbolsEditRounded from './icons/material-symbols/MaterialSymbolsEditRounded';
import { Button, ButtonProps } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

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
