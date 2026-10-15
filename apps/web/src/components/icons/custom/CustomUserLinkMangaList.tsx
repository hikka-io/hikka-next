import type { SVGProps } from 'react';

export function CustomUserLinkMangaList(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <clipPath id="CustomUserLinkMangaListClip">
                <rect width="24" height="24" rx="6" />
            </clipPath>
            <image
                width="24"
                height="24"
                href="/icons/platforms/user-link-mangalist.png"
                clipPath="url(#CustomUserLinkMangaListClip)"
            />
        </svg>
    );
}
export default CustomUserLinkMangaList;
