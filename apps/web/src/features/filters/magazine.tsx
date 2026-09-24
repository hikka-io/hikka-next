import type { FC } from 'react';

import { Newspaper } from 'lucide-react';

import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';

type Props = {
    value: string[] | undefined;
    onChange: (value: string[] | undefined) => void;
};

const Magazine: FC<Props> = ({ value, onChange }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Newspaper className="size-4 shrink-0" />
                <Label>Журнали</Label>
            </div>
            <InputTags
                id="magazines"
                placeholder="Slug журналу..."
                value={value ?? []}
                onChange={(magazines) => {
                    const next = magazines as string[];
                    onChange(next.length ? next : undefined);
                }}
            />
        </div>
    );
};

export default Magazine;
