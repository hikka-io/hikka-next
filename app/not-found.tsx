import Link from "next/link";
import Image from "@/app/_components/Image";
import React from "react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="grow flex flex-col gap-8 items-center justify-center">
                <div className="flex flex-col gap-4 justify-center">
                    <div className="flex gap-4 justify-center">
                        <Image
                            src="/logo.svg"
                            alt="Hikka"
                            width={80}
                            height={24}
                        />
                        <div className="divider divider-horizontal" />
                        <h1 className="text-center text-[3rem]">404</h1>
                    </div>
                    <p className="">
                        На жаль, такої сторінки не існує 😢
                    </p>
                </div>
                <Link className="btn btn-accent btn-outline" href="/">
                    На головну
                </Link>
            </div>
        </div>
    );
}
