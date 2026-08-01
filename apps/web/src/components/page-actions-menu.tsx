import type { FC, PropsWithChildren } from 'react';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/cn';

type Props = PropsWithChildren & {
    url: string;
    className?: string;
};

const PageActionsMenu: FC<Props> = ({ url, className, children }) => {
    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(`${window.location.origin}${url}`)
            .then(() => toast.success('Посилання скопійовано'))
            .catch(() => toast.error('Не вдалося скопіювати посилання'));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-md"
                    className={cn(
                        'text-muted-foreground [&_svg]:size-5',
                        className,
                    )}
                    aria-label="Більше"
                >
                    <MaterialSymbolsMoreHoriz />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy />
                    Скопіювати посилання
                </DropdownMenuItem>
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PageActionsMenu;
