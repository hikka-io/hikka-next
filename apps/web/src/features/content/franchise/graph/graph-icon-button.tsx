import type { FC } from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = Omit<ButtonProps, 'aria-label'> & { label: string };

const GraphIconButton: FC<Props> = ({
    label,
    variant = 'outline',
    size = 'icon-md',
    ...props
}) => (
    <Tooltip>
        <TooltipTrigger
            render={
                <Button
                    variant={variant}
                    size={size}
                    aria-label={label}
                    {...props}
                />
            }
        />
        <TooltipContent>{label}</TooltipContent>
    </Tooltip>
);

export default GraphIconButton;
