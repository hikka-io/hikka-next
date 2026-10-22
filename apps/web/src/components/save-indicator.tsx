import type { FC, ReactNode } from 'react';

import { CloudAlert, CloudCheck } from 'lucide-react';

import Spinner from '@/components/ui/spinner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

export type SaveTone =
    | 'saving'
    | 'error'
    | 'unsaved'
    | 'published'
    | 'saved'
    | 'draft';

type DotProps = {
    className: string;
};

const Dot: FC<DotProps> = ({ className }) => (
    <span className={cn('size-1.5 rounded-full', className)} />
);

const ICONS: Record<SaveTone, ReactNode> = {
    saving: <Spinner size="sm" />,
    error: <CloudAlert className="text-destructive-foreground" />,
    unsaved: <Dot className="bg-warning-foreground" />,
    published: <Dot className="bg-success-foreground" />,
    saved: <CloudCheck />,
    draft: null,
};

type Props = {
    tone: SaveTone;
    label: string;
    /** Shown in a tooltip when the save failed. */
    error?: string;
};

const SaveIndicator: FC<Props> = ({ tone, label, error }) => {
    const status = (
        <span
            role="status"
            className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground text-xs [&_svg]:size-3.5"
        >
            {ICONS[tone]}
            {label}
        </span>
    );

    return tone === 'error' && error ? (
        <Tooltip>
            <TooltipTrigger render={status} />
            <TooltipContent>{error}</TooltipContent>
        </Tooltip>
    ) : (
        status
    );
};

export default SaveIndicator;
