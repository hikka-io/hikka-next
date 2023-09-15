'use client'

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Input from "@/app/components/Input";

const Component = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const [search, setSearch] = useState(searchParams.get('search'));

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams);

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
            <label className="label">
                <span className="label-text text-secondary">Пошук</span>
            </label>
            <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Ввведіть назву аніме"
            />
        </div>
    );
};

export default Component;
