import {motion} from 'framer-motion';
import React from 'react';
import logo from '../assets/logo512.png';

export const LogoLoader = () => {
    return (
        <motion.img
            src={logo}
            style={{height: 240}}
            animate={{rotate: 120}}
            transition={{repeat: Infinity, repeatDelay: 0.5}}
        />
    );
};
