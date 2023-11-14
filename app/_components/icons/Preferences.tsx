import { SVGProps } from 'react';

export default function PajamasPreferences(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            {...props}
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 6.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3ZM12 8a3 3 0 1 0-2.905-3.75H1.75a.75.75 0 0 0 0 1.5h7.345A3.001 3.001 0 0 0 12 8Zm-6.5 3a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Zm1.405.75A3.001 3.001 0 0 1 1 11a3 3 0 0 1 5.905-.75h7.345a.75.75 0 0 1 0 1.5H6.905Z"
                clipRule="evenodd"
            ></path>
        </svg>
    );
}
