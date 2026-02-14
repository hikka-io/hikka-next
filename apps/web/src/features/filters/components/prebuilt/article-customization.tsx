'use client';

import { Eye } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useChangeParam } from '@/features/filters';

interface Props {
    className?: string;
}

const ArticleCustomization: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const draft = searchParams.get('draft');

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
