import { cn } from '@/utils/cn';

export const navRowClassName = cn(
    'flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
    'text-muted-foreground',
    'hover:bg-accent hover:text-foreground',
    // Active tint mirrors SELECTED_TINT; the hover pair keeps it from falling
    // back to the neutral hover above.
    'data-[active=true]:bg-primary-foreground/15 data-[active=true]:font-medium data-[active=true]:text-primary-foreground',
    'data-[active=true]:hover:bg-primary-foreground/20 data-[active=true]:hover:text-primary-foreground',
    '[&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
);

export const navGroupLabelClassName =
    'px-2 py-1.5 font-medium text-muted-foreground/70 text-xs';
