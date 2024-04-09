'use client';

import clsx from 'clsx';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EDIT_STATUSES } from '@/utils/constants';
import createQueryString from '@/utils/createQueryString';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const SORT = [
    {
        label: 'Номер правки',
        value: 'edit_id',
    },
    {
        label: 'Дата створення',
        value: 'created',
    },
];

const CONTENT_TYPES: Record<string, any> = {
    anime: {
        title_ua: 'Аніме',
        title_en: 'Anime',
    },
    character: {
        title_ua: 'Персонаж',
        title_en: 'Character',
    },
    person: {
        title_ua: 'Людина',
        title_en: 'Person',
    },
};

const Component = ({ className }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const content_type = searchParams.get('content_type');
    const order = searchParams.get('order');
    const sort = searchParams.get('sort');
    const edit_status = searchParams.get('edit_status');

    const clearFilters = () => {
        router.replace(`${pathname}`);
    };

    const handleChangeParam = (
        name: string,
        value: string | string[] | boolean,
    ) => {
        const query = createQueryString(
            name,
            value,
            createQueryString(
                'page',
                '1',
                createQueryString(
                    'iPage',
                    '1',
                    new URLSearchParams(searchParams),
                ),
            ),
        );
        router.replace(`${pathname}?${query}`);
    };

    return (
        <ScrollArea
            className={cn(
                'flex flex-col items-start gap-8',
                'border-t border-t-transparent',
                'transition',
                'h-full lg:max-h-[calc(100vh-6rem)]',
                className,
            )}
        >
            <div className="flex w-full flex-col items-start gap-8 py-4">
                <div className="flex w-full flex-col gap-4">
                    <Label className="text-muted-foreground">Сортування</Label>
                    <div className="flex gap-2">
                        <Combobox
                            className="flex-1"
                            selectPlaceholder="Виберіть тип сортування..."
                            options={SORT}
                            multiple={false}
                            value={sort || 'edit_id'}
                            onChange={(value) =>
                                handleChangeParam('sort', value)
                            }
                        />
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                                handleChangeParam(
                                    'order',
                                    order === 'asc' ? 'desc' : 'asc',
                                )
                            }
                        >
                            <MaterialSymbolsSortRounded
                                className={clsx(
                                    order === 'asc' && '-scale-y-100',
                                )}
                            />
                        </Button>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-4">
                    <Label className="text-muted-foreground">Статус</Label>
                    <Combobox
                        className="flex-1"
                        selectPlaceholder="Виберіть статус..."
                        options={Object.keys(EDIT_STATUSES).map((status) => ({
                            label: EDIT_STATUSES[status as API.EditStatus]
                                .title_ua,
                            value: status,
                        }))}
                        multiple={false}
                        value={edit_status || undefined}
                        onChange={(value) =>
                            handleChangeParam('edit_status', value)
                        }
                    />
                </div>
                <div className="flex w-full flex-col gap-4">
                    <Label className="text-muted-foreground">
                        Тип контенту
                    </Label>
                    <Combobox
                        className="flex-1"
                        selectPlaceholder="Виберіть тип контенту..."
                        options={Object.keys(CONTENT_TYPES).map(
                            (content_type) => ({
                                label: CONTENT_TYPES[content_type].title_ua,
                                value: content_type,
                            }),
                        )}
                        multiple={false}
                        value={content_type || undefined}
                        onChange={(value) =>
                            handleChangeParam('content_type', value)
                        }
                    />
                </div>
            </div>
            <Button
                variant="secondary"
                className="sticky bottom-4 mt-8 w-full shadow-md lg:flex"
                onClick={clearFilters}
            >
                <AntDesignClearOutlined /> Очистити
            </Button>
        </ScrollArea>
    );
};

export default Component;
