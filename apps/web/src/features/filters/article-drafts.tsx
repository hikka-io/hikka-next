import type { FC } from 'react';

import { Eye } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRouteSearch } from '@/utils/navigation';

import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
};

const ArticleDraftsFilter: FC<Props> = () => {
    const { draft } = useRouteSearch<{ draft?: boolean }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="size-4 shrink-0" />
                <Label htmlFor="draft">Чернетки</Label>
            </div>
            <Switch
                checked={Boolean(draft)}
                onCheckedChange={() => handleChangeParam('draft', !draft)}
                id="draft"
            />
        </div>
    );
};

export default ArticleDraftsFilter;
