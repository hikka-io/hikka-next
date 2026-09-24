import { type FC, useEffect, useState } from 'react';

import { Hash } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDebounce from '@/services/hooks/use-debounce';

type Props = {
    resetKey: unknown;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
};

const MalId: FC<Props> = ({ resetKey, value, onChange }) => {
    const [input, setInput] = useState(
        value !== undefined ? String(value) : '',
    );
    const [debounced] = useDebounce({ value: input, delay: 500 });

    // biome-ignore lint/correctness/useExhaustiveDependencies: resetKey discards an in-flight edit on tab switch
    useEffect(() => {
        setInput(value !== undefined ? String(value) : '');
    }, [value, resetKey]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: commit only when the debounced input settles, not on every value/onChange identity
    useEffect(() => {
        const parsed = debounced ? Number(debounced) : undefined;
        if (parsed === value) return;
        onChange(parsed);
    }, [debounced]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="size-4 shrink-0" />
                <Label htmlFor="mal_id">MAL ID</Label>
            </div>
            <Input
                id="mal_id"
                inputMode="numeric"
                placeholder="Введіть MAL ID..."
                value={input}
                onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
            />
        </div>
    );
};

export default MalId;
