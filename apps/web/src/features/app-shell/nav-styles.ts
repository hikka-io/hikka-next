import { cn } from '@/utils/cn';

export const navRowClassName = cn(
    'flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
    'text-muted-foreground',
    'hover:bg-accent hover:text-foreground',
    'data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-foreground',
    '[&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
);

export const navGroupLabelClassName =
    'px-2 py-1.5 font-medium text-muted-foreground/70 text-xs';
