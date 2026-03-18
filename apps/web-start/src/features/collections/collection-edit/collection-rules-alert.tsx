'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';

const CollectionRulesAlert = () => {
    const [rules, setRules] = React.useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetch(
            'https://raw.githubusercontent.com/hikka-io/rules/main/COLLECTION_RULES.md',
        )
            .then((res) => res.text())
            .then((res) => setRules(res));
    }, []);

    return (
        <>
        <div>
            <div className="flex items-center gap-4 rounded-md border border-border bg-secondary/20 p-4">
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="flex-1 text-sm">
                    Перш ніж створювати колекції, рекомендуємо ознайомитись з{' '}
                    <Button
                        onClick={() => setOpen(true)}
                        variant="link"
                        className="h-auto p-0 text-primary-foreground hover:underline"
                    >
                        нашими правилами
                    </Button>{' '}
                    створення колекцій.
                </span>
            </div>
        </div>
        <ResponsiveModal open={open} onOpenChange={setOpen}>
            <ResponsiveModalContent>
                <ResponsiveModalHeader>
                    <ResponsiveModalTitle>Правила колекцій</ResponsiveModalTitle>
                </ResponsiveModalHeader>
                <MDViewer className="overflow-scroll px-6 py-4 md:overflow-hidden md:p-0">
                    {rules}
                </MDViewer>
            </ResponsiveModalContent>
        </ResponsiveModal>
        </>
    );
};

export default CollectionRulesAlert;
