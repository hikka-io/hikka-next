import { FC } from 'react';

import { cn } from '@/utils/cn';

interface Props {
    scope: Hikka.Scope;
}

const Scope: FC<Props> = ({ scope }) => {
    if (!scope) return null;

    return (
        <div className="flex items-center gap-3">
            <div className="bg-secondary/20 rounded-sm p-1">
                <scope.level.icon className={cn('size-4', scope.level.color)} />
            </div>
            <p className="text-muted-foreground text-sm">{scope.title_ua}</p>
        </div>
    );
};

export default Scope;
