import type { FC } from 'react';

import { TriangleAlert } from 'lucide-react';

import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Props = {
    properties: Hikka.FilterProperty<string>;
    value: string[] | undefined;
    onChange: (value: string[] | undefined) => void;
};

const Issues: FC<Props> = ({ properties, value, onChange }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <TriangleAlert className="size-4 shrink-0" />
                <Label>Проблеми</Label>
            </div>
            <Select
                triState
                multiple
                value={value ?? []}
                onValueChange={(selected) =>
                    onChange(
                        (selected as string[]).length
                            ? (selected as string[])
                            : undefined,
                    )
                }
            >
                <SelectTrigger size="md">
                    <SelectValue placeholder="Виберіть проблеми..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectList>
                        <SelectGroup>
                            {Object.keys(properties).map((item) => (
                                <SelectItem key={item} value={item}>
                                    {properties[item].title_ua}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>
        </div>
    );
};

export default Issues;
