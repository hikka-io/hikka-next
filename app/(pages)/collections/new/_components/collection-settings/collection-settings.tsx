'use client';

import React from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import GroupInputs from '@/app/(pages)/collections/new/_components/collection-settings/_components/group-inputs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCollectionContext } from '@/services/providers/collection-provider';
import createQueryString from '@/utils/createQueryString';


const Component = () => {
    const { groups, setState: setCollectionState } = useCollectionContext();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const title = searchParams.get('title');

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.replace(
            pathname +
                '?' +
                createQueryString(
                    'title',
                    e.target.value,
                    new URLSearchParams(searchParams),
                ).toString(),
        );
    };

    const handleAddNewGroup = () => {
        if (groups.length === 1 && !groups[0].isGroup) {
            setCollectionState!((state) => {
                return {
                    ...state,
                    groups: [
                        {
                            ...state.groups[0],
                            title: '',
                            isGroup: true,
                        },
                    ],
                };
            });
            return;
        }

        setCollectionState!((state) => {
            return {
                ...state,
                groups: [
                    ...state.groups,
                    {
                        id: String(Date.now()),
                        title: '',
                        isGroup: true,
                        items: [],
                    },
                ],
            };
        });
    };

    return (
        <div className="flex p-4 flex-col gap-6">
            <div className="flex flex-col gap-4">
                <Label className="text-muted-foreground">Назва колекції</Label>
                <Input
                    placeholder="Введіть назву"
                    value={title || ''}
                    onChange={handleTitleChange}
                />
            </div>
            <div className="flex flex-col gap-4">
                <Label className="text-muted-foreground">Опис колекції</Label>
                <Textarea placeholder="Введіть опис" />
            </div>
            <div className="flex justify-between items-center gap-4">
                <Label htmlFor="nfsw" className="text-muted-foreground">
                    Контент +18
                </Label>
                <Switch id="nfsw" />
            </div>
            <div className="flex justify-between items-center gap-4">
                <Label htmlFor="spoilers" className="text-muted-foreground">
                    Спойлери
                </Label>
                <Switch id="spoilers" />
            </div>

            {groups.length > 0 && groups.some((group) => group.isGroup) && (
                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">Групи</Label>
                    <GroupInputs />
                </div>
            )}

            <div className="flex flex-col gap-4">
                <Button variant="outline" onClick={handleAddNewGroup}>
                    Додати групу
                </Button>
                <Button variant="secondary">Створити</Button>
            </div>
        </div>
    );
};

export default Component;
