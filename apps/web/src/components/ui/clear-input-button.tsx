import type { ComponentProps, FC } from 'react';

import MaterialSymbolsCancelRounded from '@/components/icons/material-symbols/MaterialSymbolsCancelRounded';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type Props = Omit<ComponentProps<typeof Button>, 'children'>;

const ClearInputButton: FC<Props> = ({ className, ...props }) => (
    <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Очистити"
        className={cn(
            'shrink-0 text-muted-foreground disabled:invisible',
            className,
        )}
        {...props}
    >
        <MaterialSymbolsCancelRounded />
    </Button>
);

export default ClearInputButton;
