'use client';

import * as React from 'react';
import { useState } from 'react';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import Rules from '@/app/(pages)/edit/anime/[slug]/_layout/rules.mdx';
import { Button } from '@/app/_components/ui/button';
import MarkdownModal from '@/app/_layout/markdown-modal';

const Component = () => {
    const [openEditRulesModal, setOpenEditRulesModal] = useState(false);

    return (
        <div>
            <div className="flex items-center gap-4 p-4 border rounded-md border-secondary/60 bg-secondary/30">
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="text-sm flex-1">
                    Перш ніж почати редагування контенту, рекомендуємо
                    ознайомитись з{' '}
                    <Button
                        onClick={() => setOpenEditRulesModal(true)}
                        variant="link"
                        className="text-primary hover:underline p-0 h-auto"
                    >
                        нашими правилами
                    </Button>{' '}
                    редагування контенту.
                </span>
            </div>
            <MarkdownModal
                className="max-w-xl"
                setOpen={setOpenEditRulesModal}
                open={openEditRulesModal}
                title="Правила редагування"
                data={<Rules />}
            />
        </div>
    );
};

export default Component;