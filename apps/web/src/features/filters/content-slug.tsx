import { type FC, useEffect, useState } from 'react';

import { Link2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDebounce from '@/services/hooks/use-debounce';

type Props = {
    resetKey: unknown;
    value: string | undefined;
    onChange: (value: string | undefined) => void;
};

// Character/person todo endpoints have no mal_id filter; the parent content slug stands in.
const ContentSlug: FC<Props> = ({ resetKey, value, onChange }) => {
    const [input, setInput] = useState(value ?? '');
    const [debounced] = useDebounce({ value: input, delay: 500 });

    // biome-ignore lint/correctness/useExhaustiveDependencies: resetKey discards an in-flight edit on tab switch
    useEffect(() => {
        setInput(value ?? '');
    }, [value, resetKey]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: commit only when the debounced input settles, not on every value/onChange identity
    useEffect(() => {
        const parsed = debounced || undefined;
        if (parsed === value) return;
        onChange(parsed);
    }, [debounced]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Link2 className="size-4 shrink-0" />
                <Label htmlFor="content_slug">Slug контенту</Label>
            </div>
            <Input
                id="content_slug"
                placeholder="Введіть slug контенту..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
        </div>
    );
};

export default ContentSlug;
