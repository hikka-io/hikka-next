'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
}

const ArticleCustomization: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const draft = searchParams.get('draft');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter title="Відображення" active={Boolean(draft)}>
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
