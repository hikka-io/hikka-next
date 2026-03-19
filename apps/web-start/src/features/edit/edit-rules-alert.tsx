'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

const EditRulesAlert = () => {
    const [rules, setRules] = React.useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/hikka-io/rules/main/RULES.md')
            .then((res) => res.text())
            .then((res) => setRules(res));
    }, []);

    return (
        <div>
            <div className="border-border bg-secondary/20 flex items-center gap-4 rounded-md border p-4">
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="flex-1 text-sm">
                    Перш ніж почати редагування контенту, рекомендуємо
                    ознайомитись з{' '}
                    <Button
                        onClick={() => setOpen(true)}
                        variant="link"
                        className="text-primary-foreground h-auto p-0 hover:underline"
                    >
                        нашими правилами
                    </Button>{' '}
                    редагування контенту.
                </span>
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
                <ResponsiveModalContent
                    className="max-w-xl!"
                    title="Правила редагування"
                >
                    <MDViewer className="overflow-scroll px-6 py-4 md:overflow-hidden md:p-0">
                        {rules}
                    </MDViewer>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </div>
    );
};

export default EditRulesAlert;
