import { redirect } from 'next/navigation';

import List from './_components/anime-list';

const Component = ({
    searchParams,
}: {
    searchParams: Record<string, string>;
}) => {
    const page = searchParams.page;

    if (!page) {
        return redirect(
            `/anime?page=1&iPage=1&${new URLSearchParams(
                searchParams,
            ).toString()}`,
        );
    }

    return <List searchParams={searchParams} />;
};

export default Component;
