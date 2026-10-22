import type { ComponentProps, FC } from 'react';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = ComponentProps<typeof Button> & {
    /** The tooltip, which also names the button. */
    hint: string;
};

/** An icon-only button that explains itself on hover. */
const HintButton: FC<Props> = ({ hint, ...props }) => (
    <Tooltip>
        <TooltipTrigger
            render={
                <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={hint}
                    {...props}
                />
            }
        />
        <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
);

export default HintButton;
