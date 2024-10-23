import { FC, PropsWithChildren } from 'react';
import MaterialSymbolsCategoryOutlineRounded from '~icons/material-symbols/category-outline-rounded';

import Card from '@/components/ui/card';
import HorizontalCard from '@/components/ui/horizontal-card';

interface Props extends PropsWithChildren {
    title: string;
    image: string;
    contentType: API.ContentType;
    href?: string;
}

const CONTENT_TYPES: Record<API.ContentType, string> = {
    novel: 'Ранобе',
    manga: 'Манґа',
    edit: 'Правка',
    anime: 'Аніме',
    character: 'Персонаж',
    person: 'Автор',
    comment: 'Коментар',
    collection: 'Колекція',
};

const GeneralCard: FC<Props> = ({
    title,
    image,
    contentType,
    href,
    children,
}) => {
    return (
        <>
            <div className="hidden w-full items-center gap-4 px-16 md:px-48 lg:flex lg:px-0">
                <Card className="w-full">
                    <HorizontalCard
                        image={image}
                        imageContainerClassName="w-14"
                        title={title}
                        titleClassName="font-semibold"
                        description={
                            <div className="flex flex-col gap-1">
                                <a className="flex cursor-default items-center gap-1.5 font-medium">
                                    <MaterialSymbolsCategoryOutlineRounded className="size-4 text-muted-foreground" />
                                    {CONTENT_TYPES[contentType]}
                                </a>
                                {children}
                            </div>
                        }
                        href={href || '#'}
                    />
                </Card>
            </div>
            <div className="flex w-full gap-4 lg:hidden">
                <Card className="w-full">
                    <HorizontalCard
                        image={image}
                        imageContainerClassName="w-14"
                        title={title}
                        titleClassName="font-semibold"
                        description={
                            <div className="flex flex-col gap-1">
                                <a className="flex cursor-default items-center gap-1.5 font-medium">
                                    <MaterialSymbolsCategoryOutlineRounded className="size-4 text-muted-foreground" />
                                    {CONTENT_TYPES[contentType]}
                                </a>
                                {children}
                            </div>
                        }
                        href={href || '#'}
                    />
                </Card>
            </div>
        </>
    );
};

export default GeneralCard;
