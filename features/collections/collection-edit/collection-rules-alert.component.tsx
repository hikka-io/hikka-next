'use client';

import * as React from 'react';
import { useEffect } from 'react';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Button } from '@/components/ui/button';

import { useModalContext } from '@/services/providers/modal-provider';

const CollectionRulesAlert = () => {
    const [rules, setRules] = React.useState('');
    const { openModal } = useModalContext();

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/hikka-io/rules/main/COLLECTION_RULES.md')
            .then((res) => res.text())
            .then((res) => setRules(res));
    }, []);

    return (
        <div>
            <div className="flex items-center gap-4 rounded-md border border-secondary/60 bg-secondary/30 p-4">
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="flex-1 text-sm">
                    Перш ніж створювати колекції, рекомендуємо
                    ознайомитись з{' '}
                    <Button
                        onClick={() =>
                            openModal({
                                content: (
                                    <MDViewer className="px-6 py-4 md:overflow-hidden md:p-0">
                                        {rules}
                                    </MDViewer>
                                ),
                                title: 'Правила колекцій',
                            })
                        }
                        variant="link"
                        className="h-auto p-0 text-primary hover:underline"
                    >
                        нашими правилами
                    </Button>{' '}
                    створення колекцій.
                </span>
            </div>
        </div>
    );
};

export default CollectionRulesAlert;
