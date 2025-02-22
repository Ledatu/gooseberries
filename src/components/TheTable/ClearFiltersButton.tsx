'use client';

import {Button, Icon} from '@gravity-ui/uikit';
import {FunnelXmark} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {useMemo} from 'react';

export const ClearFiltersButton = ({filters, setFilters, filterData}: any) => {
    const filtersUsed = useMemo(() => {
        for (const [key, val] of Object.entries(filters as any)) {
            if (!key || !val || key == 'undef') continue;
            if ((val as any)['val'] != '') return true;
        }
        return false;
    }, [filters]);

    return (
        <motion.div
            style={{width: 0, overflow: 'hidden'}}
            animate={{
                width: filtersUsed ? 106 : 0,
                marginRight: filtersUsed ? 8 : 0,
            }}
        >
            <Button
                selected
                onClick={() => {
                    setFilters(() => {
                        const newFilters: any = {undef: true};
                        for (const [key, filterData] of Object.entries(filters as any)) {
                            if (key == 'undef' || !key || !filterData) continue;
                            newFilters[key] = {
                                val: '',
                                compMode: (filterData as any)['compMode'] ?? 'include',
                            };
                        }
                        filterData(newFilters);
                        return {...newFilters};
                    });
                }}
            >
                <Icon data={FunnelXmark} />
                Очистить
            </Button>
        </motion.div>
    );
};
