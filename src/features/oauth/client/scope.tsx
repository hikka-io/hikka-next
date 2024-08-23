import { FC } from 'react';

import P from '@/components/typography/p';

import { cn } from '@/utils/utils';

interface Props {
    scope: Hikka.Scope;
}

const Scope: FC<Props> = ({ scope }) => {
    if (!scope) return null;

    return (
        <div className="flex gap-3 items-center">
            <div className="rounded-sm bg-secondary/30 p-1">
                <scope.level.icon className={cn('size-4', scope.level.color)} />
            </div>
            <P className="text-muted-foreground text-sm">{scope.title_ua}</P>
        </div>
    );
};

export default Scope;
