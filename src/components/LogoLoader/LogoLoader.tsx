'use client';
import {motion} from 'framer-motion';

export const LogoLoader = () => {
    return (
        <motion.svg
            // style={{height: '30%'}}
            style={{height: 240}}
            animate={{rotate: 120}}
            transition={{repeat: Infinity, repeatDelay: 0.5}}
            xmlns="http://www.w3.org/2000/svg"
            width="387"
            height="445"
            viewBox="0 0 387 445"
            fill="none"
        >
            <path
                d="M106 100L0 162V285L106.5 346L106 223.5L212 161.5L106 100Z"
                fill="url(#paint0_linear_2_8)"
            />
            <path
                d="M120 352.799L226.694 413.597L333.215 352.097L332.792 229.366L226.954 291.049L120.261 230.25L120 352.799Z"
                fill="url(#paint1_linear_2_8)"
            />
            <path
                d="M333.042 214.799L332.349 92L225.828 30.5L119.75 92.2317L226.088 153.049L226.782 275.847L333.042 214.799Z"
                fill="url(#paint2_linear_2_8)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_2_8"
                    x1="-0.500002"
                    y1="162.5"
                    x2="105.5"
                    y2="223.5"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FAC73A" />
                    <stop offset="1" stopColor="#FBB03F" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_2_8"
                    x1="227.377"
                    y1="413.78"
                    x2="227.204"
                    y2="291.482"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FAC73A" />
                    <stop offset="1" stopColor="#FBB03F" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_2_8"
                    x1="332.166"
                    y1="91.317"
                    x2="226.338"
                    y2="152.616"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FAC73A" />
                    <stop offset="1" stopColor="#FBB03F" />
                </linearGradient>
            </defs>
        </motion.svg>
    );
};
