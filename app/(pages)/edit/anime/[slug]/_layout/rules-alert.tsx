'use client';

import * as React from 'react';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import Rules from '@/app/(pages)/edit/anime/[slug]/_layout/rules.mdx';
import { Button } from '@/app/_components/ui/button';
import { useModalContext } from '@/utils/providers/modal-provider';

const Component = () => {
    const { openModal } = useModalContext();

    return (
        <div>
            <div className="flex items-center gap-4 p-4 border rounded-md border-secondary/60 bg-secondary/30">
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="text-sm flex-1">
                    Перш ніж почати редагування контенту, рекомендуємо
                    ознайомитись з{' '}
                    <Button
                        onClick={() =>
                            openModal({
                                content: <Rules />,
                                className: 'max-w-xl',
                                title: 'Правила редагування',
                            })
                        }
                        variant="link"
                        className="text-primary hover:underline p-0 h-auto"
                    >
                        нашими правилами
                    </Button>{' '}
                    редагування контенту.
                </span>
            </div>
        </div>
    );
};

export default Component;