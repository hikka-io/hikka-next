'use client';

import { Eye } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { CollapsibleFilter } from '@/components/collapsible-filter';
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
        <CollapsibleFilter
            title="Відображення"
            icon={<Eye className="size-4" />}
            active={Boolean(draft)}
        >
            <div className="flex items-center justify-between gap-2">
                <Label className="text-muted-foreground" htmlFor="draft">
                    Чернетки
                </Label>
                <Switch
                    checked={Boolean(draft)}
                    onCheckedChange={() =>
                        handleChangeParam('draft', !Boolean(draft))
                    }
                    id="draft"
                />
            </div>
        </CollapsibleFilter>
    );
};

export default ArticleCustomization;
