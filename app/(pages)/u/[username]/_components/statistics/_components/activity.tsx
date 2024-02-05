import React from 'react';

import { Label } from '@/app/_components/ui/label';

const Component = () => {
    return (
        <div className="flex flex-col gap-4 min-h-28 md:min-h-0 flex-1 bg-secondary/30 border border-secondary/60 p-4 rounded-md">
            <Label className="text-muted-foreground">Активність</Label>
            <div className="flex gap-4 items-end flex-1">
                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />

                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />

                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />

                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />
                <div className="w-2 h-full rounded-full bg-primary" />
            </div>
        </div>
    );
};

export default Component;