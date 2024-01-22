import List from './_layout/list';
import { redirect } from 'next/navigation';

const Component = ({ searchParams }: {  searchParams: { [key: string]: string | string[] | undefined } }) => {
    const page = searchParams.page;

    if (!page) {
        redirect('/anime?page=1&iPage=1');
    }

    return <List />;
};

export default Component;
