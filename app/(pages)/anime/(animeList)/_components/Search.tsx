'use client';

import { useCallback, useEffect, useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import Input from '@/app/_components/Input';
import useRouter from '@/utils/useRouter';

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
        <div className="form-control w-full">
            <label className="label hidden lg:flex">
                <span className="label-text">Пошук по назві</span>
            </label>
            <input
                className="input bg-secondary/60 w-full"
                value={search || ''}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Ввведіть назву аніме"
            />
        </div>
    );
};

export default Component;
