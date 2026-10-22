import type { FC } from 'react';

import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link } from '@/utils/navigation';

type Props = {
    /** The published page; without it nothing is saved yet, so the button is disabled. */
    to?: string;
    size?: 'icon-sm' | 'icon-md';
};

const PreviewButton: FC<Props> = ({ to, size = 'icon-sm' }) => (
    <Tooltip>
        <TooltipTrigger
            render={
                <Button
                    variant="outline"
                    size={size}
                    aria-label="Переглянути"
                    disabled={!to}
                    render={to ? <Link target="_blank" to={to} /> : undefined}
                />
            }
        >
            <MaterialSymbolsVisibilityOutlineRounded />
        </TooltipTrigger>
        <TooltipContent>Переглянути</TooltipContent>
    </Tooltip>
);

export default PreviewButton;
