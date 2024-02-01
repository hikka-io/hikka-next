'use client';

import { useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import createQueryString from '@/app/_utils/createQueryString';

const Component = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const [search, setSearch] = useState(searchParams.get('search'));

    const handleChangeSearch = (value: string) => {
        const query = createQueryString(
            'search',
            value,
            new URLSearchParams(searchParams),
        );
        setSearch(value);

        router.replace(`${pathname}?${query}`);
    };

    return (
        <div className="flex flex-col gap-4 flex-1">
            <Label className="text-muted-foreground hidden lg:flex">
                Пошук по назві
            </Label>
            <Input
                value={search || ''}
                onChange={(event) => handleChangeSearch(event.target.value)}
                type="text"
                placeholder="Введіть назву аніме..."
            />
        </div>
    );
};

export default Component;