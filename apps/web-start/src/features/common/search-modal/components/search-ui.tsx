import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import { cn } from '@/utils/cn';

type CommandListProps = React.ComponentProps<typeof CommandList>;
type CommandGroupProps = React.ComponentProps<typeof CommandGroup>;
type CommandItemProps = React.ComponentProps<typeof CommandItem>;

export function SearchList({ className, ...props }: CommandListProps) {
    return <CommandList className={cn('max-h-none', className)} {...props} />;
}

export function SearchGroup({ className, ...props }: CommandGroupProps) {
    return (
        <CommandGroup
            className={cn('p-0! **:[[cmdk-group-heading]]:px-3!', className)}
            {...props}
        />
    );
}

export function SearchItem({ className, ...props }: CommandItemProps) {
    return (
        <CommandItem
            className={cn(
                'rounded-none! border-t px-3! first:border-t-0',
                className,
            )}
            {...props}
        />
    );
}
