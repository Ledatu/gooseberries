import {Button, Checkbox, Icon, Popup, Text} from '@gravity-ui/uikit';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ListCheck, FunnelXmark} from '@gravity-ui/icons';
import {motion} from 'framer-motion';

interface PopupFilterArtsProps {
    filters: {
        scheduleRules: boolean;
        budgetRules: boolean;
        phrasesRules: boolean;
        bidderRules: boolean;
    };
    setFilters: React.Dispatch<
        React.SetStateAction<{
            scheduleRules: boolean;
            budgetRules: boolean;
            phrasesRules: boolean;
            bidderRules: boolean;
        }>
    >;
}

export const PopupFilterArts = ({filters, setFilters}: PopupFilterArtsProps) => {
    const ref = useRef(null);
    const [showPopup, setShowPopup] = useState(false);
    const [filtersRK, setFiltersRK] = useState({} as any);

    const checkEqualObjects = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const defaultObj = useMemo(
        () => ({
            scheduleRules: false,
            budgetRules: false,
            phrasesRules: false,
            bidderRules: false,
        }),
        [],
    );
    const isChanged = useMemo(() => !checkEqualObjects(filtersRK, defaultObj), [filtersRK]);

    const isFiltersSame = useMemo(
        () => checkEqualObjects(filters, filtersRK),
        [filtersRK, filters],
    );

    useEffect(() => {
        setFiltersRK(filters);
    }, [showPopup]);

    const checkFilters = () => {
        return Object.values(filters).includes(true);
    };

    const checkboxes = () => {
        const names = {
            bidderRules: 'РК без автоставок',
            budgetRules: 'РК без бюджета',
            phrasesRules: 'РК без управления фразами',
            scheduleRules: 'РК без графика',
        };
        const elements: React.JSX.Element[] = [];
        for (const [key, val] of Object.entries(names)) {
            elements.push(
                <Checkbox
                    content={val}
                    defaultChecked={filtersRK[key]}
                    onUpdate={(value) => {
                        const states = {...filtersRK};
                        states[key] = value;
                        setFiltersRK(states);
                    }}
                />,
            );
        }
        return elements;
    };
    return (
        <>
            <Popup offset={[-4, 9]} anchorRef={ref} open={showPopup} placement={'bottom-end'}>
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
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid #eee2',
                            borderRadius: '0px 0px 8px 8px',
                            position: 'absolute',
                            left: -197,
                            top: -3,
                            padding: '0 8px',
                            width: 210,
                        }}
                    >
                        <div
                            style={{
                                marginTop: '8px',
                                marginBottom: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                            }}
                        >
                            {checkboxes()}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', marginBottom: 8}}>
                            <Button
                                size="l"
                                selected
                                pin="circle-circle"
                                style={{marginLeft: 8}}
                                disabled={isFiltersSame}
                                onClick={() => {
                                    setFilters(filtersRK);
                                    setShowPopup(false);
                                }}
                            >
                                <Text variant="subheader-1">Установить фильтр</Text>
                            </Button>
                            <motion.div
                                style={{
                                    marginLeft: isChanged ? 8 : 0,
                                    marginRight: isChanged ? 8 : 0,
                                    width: isChanged ? 36 : 0,
                                    overflow: 'hidden',
                                }}
                                animate={{
                                    marginLeft: isChanged ? 8 : 0,
                                    marginRight: isChanged ? 8 : 0,
                                    width: isChanged ? 36 : 0,
                                }}
                            >
                                <Button
                                    size="l"
                                    pin="circle-circle"
                                    onClick={() => {
                                        setFilters(defaultObj);
                                        setShowPopup(false);
                                    }}
                                >
                                    <Icon data={FunnelXmark} />
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Popup>
            <Button
                style={{
                    marginLeft: 5,
                    width: '28px',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                ref={ref}
                view={checkFilters() ? 'outlined-warning' : 'outlined'}
                onClick={() => {
                    setShowPopup(!showPopup);
                }}
            >
                {/* <Text color={checkFilters() ? 'warning' : undefined}> */}
                <Icon data={ListCheck} size={14} />
                {/* </Text> */}
            </Button>
        </>
    );
};
