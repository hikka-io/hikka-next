'use client';

import { Eye } from 'lucide-react';
import { FC } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

interface Props {
    className?: string;
}

const ArticleCustomization: FC<Props> = () => {
    const { draft } = useFilterSearch<{ draft?: boolean }>();

    const handleChangeParam = useChangeParam();

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="size-4 shrink-0" />
                <Label htmlFor="draft">Чернетки</Label>
            </div>
            <Switch
                checked={Boolean(draft)}
                onCheckedChange={() =>
                    handleChangeParam('draft', !Boolean(draft))
                }
                id="draft"
            />
        </div>
    );
};

export default ArticleCustomization;
