'use client';

import * as React from 'react';
import { useEffect } from 'react';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import { Button } from '@/app/_components/ui/button';
import { useModalContext } from '@/app/_utils/providers/modal-provider';
import MDViewer from '@/app/_components/markdown/viewer/MD-viewer';

const Component = () => {
    const [rules, setRules] = React.useState('');
    const { openModal } = useModalContext();

    useEffect(() => {
        fetch(
            'https://raw.githubusercontent.com/hikka-io/bug-reports/main/RULES.md',
        )
            .then((res) => res.text())
            .then((res) => setRules(res));
    }, []);

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
                                content: <MDViewer className="overflow-hidden">{rules}</MDViewer>,
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