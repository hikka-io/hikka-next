import { type FC, useEffect, useState } from 'react';

import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import { MDViewer } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

type Props = {
    rulesFile: string;
    before: string;
    after: string;
    modalTitle: string;
};

const RulesAlert: FC<Props> = ({ rulesFile, before, after, modalTitle }) => {
    const [rules, setRules] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetch(
            `https://raw.githubusercontent.com/hikka-io/rules/main/${rulesFile}`,
        )
            .then((res) => res.text())
            .then((res) => setRules(res));
    }, [rulesFile]);

    return (
        <>
            <div className="flex items-center gap-4 rounded-md border border-border surface p-4">
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="flex-1 text-sm">
                    {before}{' '}
                    <Button
                        onClick={() => setOpen(true)}
                        variant="link"
                        className="h-auto p-0 text-primary-foreground hover:underline"
                    >
                        нашими правилами
                    </Button>{' '}
                    {after}
                </span>
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen}>
                <ResponsiveModalContent
                    className="md:max-w-xl"
                    title={modalTitle}
                >
                    <MDViewer className="-m-4 overflow-scroll p-4">
                        {rules}
                    </MDViewer>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default RulesAlert;
