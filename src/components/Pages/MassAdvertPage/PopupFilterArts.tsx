'use client';

import {Button, Checkbox, Icon, Popup, Text} from '@gravity-ui/uikit';
import {useEffect, useMemo, useState} from 'react';
import {ListCheck, FunnelXmark} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {BluredCard} from '@/shared/ui/BluredCard';

interface PopupFilterArtsProps {
    filters: {
        scheduleRules: boolean;
        budgetRules: boolean;
        phrasesRules: boolean;
        bidderRules: boolean;
        activeAdverts: boolean;
        pausedAdverts: boolean;
    };
    setFilters: React.Dispatch<
        React.SetStateAction<{
            scheduleRules: boolean;
            budgetRules: boolean;
            phrasesRules: boolean;
            bidderRules: boolean;
            activeAdverts: boolean;
            pausedAdverts: boolean;
        }>
    >;
}

export const PopupFilterArts = ({filters, setFilters}: PopupFilterArtsProps) => {
    const [showPopup, setShowPopup] = useState(false);
    const [filtersRK, setFiltersRK] = useState({} as any);
    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);

    const checkEqualObjects = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
    const defaultObj = useMemo(
        () => ({
            scheduleRules: false,
            budgetRules: false,
            phrasesRules: false,
            bidderRules: false,
            activeAdverts: false,
            pausedAdverts: false,
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
            activeAdverts: 'РК в работе',
            pausedAdverts: 'РК на паузе',
        };
        const elements: React.JSX.Element[] = [];
        for (const [key, val] of Object.entries(names)) {
            elements.push(
                <Checkbox
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    content={<Text whiteSpace="nowrap">{val}</Text>}
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
            <Popup
                offset={{crossAxis: 100, mainAxis: 4}}
                anchorElement={anchorElement}
                open={showPopup}
                placement={'bottom-end'}
            >
                <div style={{left: -217, position: 'relative'}}>
                <BluredCard padding={false} motionDivStyle={{borderRadius: '5px 5px 10px 10px'}}>
                    {/* <div
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
                            backdropFilter: 'blur(48px)',
                            WebkitBackdropFilter: 'blur(48px)',
                            border: '1px solid #eee2',
                            borderRadius: '0px 0px 8px 8px',
                            position: 'absolute',
                            left: -197,
                            top: -3,
                            padding: '0 8px',
                        }}
                    > */}
                    <div
                        style={{
                            margin: 8,
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
                            disabled={isFiltersSame}
                            onClick={() => {
                                setFilters(filtersRK);
                                setShowPopup(false);
                            }}
                        >
                            <Text variant="subheader-1">Сохранить</Text>
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
                    {/* </div>
                </div> */}
                </BluredCard>
                </div>
            </Popup>
            <Button
                style={{
                    marginLeft: 5,
                    width: '28px',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                ref={setAnchorElement}
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
