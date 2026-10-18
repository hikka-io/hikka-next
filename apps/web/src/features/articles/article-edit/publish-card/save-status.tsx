import type { FC, ReactNode } from 'react';

import { CloudAlert, CloudCheck } from 'lucide-react';

import Spinner from '@/components/ui/spinner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

import { useArticleContext } from '../article-provider';
import { describeSave, type SaveTone } from './save-status-label';

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

const SaveStatus: FC = () => {
    const save = useArticleContext((state) => state.save);
    const draft = useArticleContext((state) => state.draft);
    const slug = useArticleContext((state) => state.slug);
    const { tone, label } = describeSave({ save, draft, slug });

    const status = (
        <span
            role="status"
            className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground text-xs [&_svg]:size-3.5"
        >
            {ICONS[tone]}
            {label}
        </span>
    );

    return tone === 'error' && save.error ? (
        <Tooltip>
            <TooltipTrigger render={status} />
            <TooltipContent>{save.error}</TooltipContent>
        </Tooltip>
    ) : (
        status
    );
};

export default SaveStatus;
