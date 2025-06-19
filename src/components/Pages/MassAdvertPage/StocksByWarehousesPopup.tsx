'use client';

import {ActionTooltip, Button, Icon, List, Popup, Text} from '@gravity-ui/uikit';
import {Box, Xmark} from '@gravity-ui/icons';
import {useEffect, useMemo, useState} from 'react';
import {motion} from 'framer-motion';

export const StocksByWarehousesPopup = ({stocksByWarehousesArt}: any) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        setTimeout(() => setOpen(false), 4000);
    }, [open]);

    const stocksByWarehousesArtArray = useMemo(() => {
        const temp = [] as any[];
        if (stocksByWarehousesArt)
            for (const [warehousesName, quantity] of Object.entries(stocksByWarehousesArt))
                temp.push(`${warehousesName}: ${quantity}`);
        return temp;
    }, [stocksByWarehousesArt]);
    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);
    return (
        <>
            <Popup open={open} hasArrow={false} anchorElement={anchorElement}>
                <div
                    style={{
                        width: 0,
                        height: 0,
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: '#221d220f',
                            backdropFilter: 'blur(48px)',
                            boxShadow: '#0006 0px 2px 8px 0px',
                            borderRadius: 30,
                            border: '1px solid #eee2',
                            width: 340,
                            left: -110,
                            height: 170,
                            overflow: 'auto',
                            position: 'absolute',
                        }}
                    >
                        <div
                            style={{
                                justifyContent: 'center',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                margin: 8,
                                position: 'relative',
                            }}
                        >
                            <Text>В наличии на складах:</Text>
                            <Button
                                onClick={() => setOpen(false)}
                                style={{position: 'absolute', right: 8}}
                                size="s"
                                pin="circle-circle"
                                view="flat"
                            >
                                <Icon data={Xmark} />
                            </Button>
                        </div>
                        <motion.div
                            style={{
                                width: '100%',
                                height: 136,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <motion.div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <List
                                    itemsHeight={136}
                                    renderItem={(item) => {
                                        return (
                                            <Text
                                                ellipsis
                                                style={{marginLeft: 16}}
                                                variant="subheader-1"
                                            >
                                                {item}
                                            </Text>
                                        );
                                    }}
                                    filterable={false}
                                    items={stocksByWarehousesArtArray}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </Popup>
            <ActionTooltip style={{width: '100%'}} title="Показывает остатки на складах">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        disabled={!stocksByWarehousesArt}
                        size="xs"
                        pin="clear-clear"
                        view="flat"
                        ref={setAnchorElement}
                        onClick={() => stocksByWarehousesArt && setOpen(!open)}
                        style={{width: '100%'}}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {stocksByWarehousesArt ? Object.keys(stocksByWarehousesArt).length : 0}
                            <div style={{minWidth: 3}} />
                            <Icon data={Box} size={11} />
                        </div>
                    </Button>
                </div>
            </ActionTooltip>
        </>
    );
};
