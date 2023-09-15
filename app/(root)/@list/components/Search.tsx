import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const Component = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const [search, setSearch] = useState('');

    const createQueryString = useCallback(
        (name: string, value: string) => {
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
            <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="Ввведіть назву аніме"
                className="input-bordered input input-lg max-w-full bg-dark-grey w-full"
            />
        </div>
    );
};

export default Component;
