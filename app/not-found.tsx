import React from 'react';

import Link from 'next/link';

import Image from '@/app/_components/ui/image';

import { Button } from './_components/ui/button';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex grow flex-col items-center justify-center gap-8">
                <div className="flex flex-col justify-center gap-4">
                    <div className="flex justify-center gap-4">
                        <Image
                            src="/logo.svg"
                            alt="Hikka"
                            width={80}
                            height={24}
                        />
                        <div className="divider divider-horizontal" />
                        <h1 className="text-center text-[3rem]">404</h1>
                    </div>
                    <p className="">На жаль, такої сторінки не існує 😢</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/">На головну</Link>
                </Button>
            </div>
        </div>
    );
}