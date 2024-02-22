import List from './_components/list';
import { redirect } from 'next/navigation';

const Component = ({ searchParams }: {  searchParams: Record<string, string> }) => {
    const page = searchParams.page;

    if (!page) {
        redirect(`/anime?page=1&iPage=1&${new URLSearchParams(searchParams).toString()}`);
    }

    return <List />;
};

export default Component;
