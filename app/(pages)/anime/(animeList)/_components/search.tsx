'use client';

import { useCallback, useEffect, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { Input } from '@/app/_components/ui/input';
import useRouter from '@/utils/useRouter';
import { Label } from '@/app/_components/ui/label';


const Component = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const [search, setSearch] = useState(searchParams.get('search'));

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams);
            params.set('page', '1');

            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams],
    );

    useEffect(() => {
        const query = createQueryString('search', search);

        router.replace(`${pathname}?${query}`);
    }, [search]);

    return (
        <div className="flex flex-col gap-4 flex-1">
            <Label className="text-muted-foreground hidden lg:flex">
                Пошук по назві
            </Label>
            <Input
                value={search || ''}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Введіть назву аніме..."
            />
        </div>
    );
};

export default Component;