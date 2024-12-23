import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    params: Promise<Record<string, any>>;
}

const ALLOWED_CATEGORIES = ['news', 'system', 'reviews'];

const ArticlesLayout: FC<Props> = async ({ children, params }) => {
    const { category } = await params;

    if (!ALLOWED_CATEGORIES.includes(category)) {
        notFound();
    }

    return children;
};

export default ArticlesLayout;
