import {Button, Icon, List, Loader, Popup, Text} from '@gravity-ui/uikit';
import {TagRuble, Xmark} from '@gravity-ui/icons';
import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import callApi from 'src/utilities/callApi';
import {useError} from 'src/pages/ErrorContext';

export const CanBeAddedToSales = ({nmId, sellerId}) => {
    const {showError} = useError();
    const [open, setOpen] = useState(false);
    const [availableSales, setAvailableSales] = useState([] as any[]);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        if (!open) return;
        let availableSalesTemp = [] as any[];
        const params = {seller_id: sellerId, nmId};
        setPending(true);
        callApi('availableSalesForNmId', params, false, true)
            .then((res) => {
                if (!res || !res['data']) return;
                availableSalesTemp = res['data'];
            })
            .catch((error) => {
                showError(error.response?.data?.error || 'Не удалось узнать доступные акции.');
            })
            .finally(() => {
                console.log(availableSalesTemp);

                setAvailableSales(availableSalesTemp);
                setPending(false);
            });
    }, [open]);

    const ref = useRef(null);
    return (
        <>
            <Popup open={open} anchorRef={ref} hasArrow={false}>
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
                            backdropFilter: 'blur(20px)',
                            boxShadow: '#0006 0px 2px 8px 0px',
                            borderRadius: 30,
                            border: '1px solid #eee2',
                            width: 340,
                            left: -70,
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
                            <Text>Можно добавить в:</Text>
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
                            {pending ? (
                                <Loader />
                            ) : (
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
                                        items={availableSales}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </Popup>
            <Button
                ref={ref}
                size="xs"
                pin="circle-circle"
                view="action"
                selected
                onClick={() => setOpen(!open)}
            >
                <Icon data={TagRuble} size={12} />
            </Button>
        </>
    );
};
