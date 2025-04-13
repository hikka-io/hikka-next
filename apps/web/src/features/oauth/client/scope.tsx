import { FC } from 'react';

import P from '../../../components/typography/p';
import { cn } from '../../../utils/utils';

interface Props {
    scope: Hikka.Scope;
}

const Scope: FC<Props> = ({ scope }) => {
    if (!scope) return null;

    return (
        <div className="flex items-center gap-3">
            <div className="rounded-sm bg-secondary/20 p-1">
                <scope.level.icon className={cn('size-4', scope.level.color)} />
            </div>
            <P className="text-sm text-muted-foreground">{scope.title_ua}</P>
        </div>
    );
};

export default Scope;
