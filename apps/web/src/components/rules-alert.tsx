import { type FC, useState } from 'react';

import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';

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

const rulesOptions = (rulesFile: string) =>
    queryOptions({
        queryKey: ['rules', rulesFile],
        queryFn: async ({ signal }) => {
            const res = await fetch(
                `https://raw.githubusercontent.com/hikka-io/rules/main/${rulesFile}`,
                { signal },
            );
            if (!res.ok) throw new Error(`Rules request failed: ${res.status}`);
            return res.text();
        },
        staleTime: Infinity,
    });

const RulesAlert: FC<Props> = ({ rulesFile, before, after, modalTitle }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { data: rules } = useQuery({
        ...rulesOptions(rulesFile),
        enabled: open,
    });

    const warmRules = () => {
        void queryClient.prefetchQuery(rulesOptions(rulesFile));
    };

    return (
        <>
            <div className="flex items-center gap-4 rounded-md border border-border surface p-4">
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="flex-1 text-sm">
                    {before}{' '}
                    <Button
                        onClick={() => setOpen(true)}
                        onPointerEnter={warmRules}
                        onFocus={warmRules}
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
                        {rules ?? ''}
                    </MDViewer>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default RulesAlert;
