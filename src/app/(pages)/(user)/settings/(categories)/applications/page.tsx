import { FC } from 'react';

import P from '@/components/typography/p';
import Link from 'next/link';
import Header from '@/components/ui/header';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import { Button } from '@/components/ui/button';

import { useModalContext } from '@/services/providers/modal-provider';
import Applications from '@/features/settings/applications/applications';

interface Props {
    params: {
        slug: string;
    };
}

const ApplicationsSettingsPage: FC<Props> = async ({ params }) => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header title="Сторонні додатки">
                    <Button asChild size="icon-sm" variant="outline">
                        <Link href="/">
                            <MaterialSymbolsAddRounded />
                        </Link>
                    </Button>
                </Header>
            </div>
            <Applications />
        </div>
    );
};

export default ApplicationsSettingsPage;