import { EditContentType } from '@hikka/client';
import { FC, useState } from 'react';

import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import { Button, ButtonProps } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { EditListModal } from '@/features/edit';

import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { cn } from '@/utils/cn';

interface Props extends ButtonProps {
    slug: string;
    content_type: EditContentType;
    className?: string;
}

const EditButton: FC<Props> = ({ className, slug, content_type, ...props }) => {
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    return (
        <>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-md"
                        onClick={() => setOpen(true)}
                        className={cn(className)}
                        {...props}
                    >
                        <MaterialSymbolsEditRounded className="!size-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Правки</TooltipContent>
            </Tooltip>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right" title="Список правок">
                    <EditListModal content_type={content_type} slug={slug} />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default EditButton;
