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
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M3 12 4 5.5l3 3L8.5 3l2.7 4.6L14 3l1.3 5.2 3.2-3L19.5 12ZM3 13.5h18v4.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM6 15.2l5 .9 5-.9-1.2 2.3H7.2Z"
            />
        </svg>
    );
}
export default CustomUserLinkMangaList;
