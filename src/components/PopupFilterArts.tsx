import {Button, Checkbox, Icon, Popup, Text} from '@gravity-ui/uikit';
import React, {useEffect, useRef, useState} from 'react';
import {ListCheck} from '@gravity-ui/icons';

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

    // dzhemDataFilter: (filter: any, data: any) => void;
    // columnDataDzhem: any[];
    // dzhemDataFilteredData: any[];
    // dzhemDataFilteredSummary: any;
}

// export const PopupFilterArts = ({setFilters, filterTableData} : PopupFilterArtsProps) => {
export const PopupFilterArts = ({filters, setFilters}: PopupFilterArtsProps) => {
    const ref = useRef(null);
    const [showPopup, setShowPopup] = useState(false);
    // const [stateCheckboxes, setStateCheckboxes] = useState([false, false, false, false, false]);
    const [filtersRK, setFiltersRK] = useState([] as any);
    const [isFiltersSame, setIsFiltersSame] = useState(true);

    useEffect(() => {
        setIsFiltersSame(checkEqualObjects());
    }, [filtersRK, filters]);

    useEffect(() => {
        setFiltersRK(filters);
    }, [showPopup]);

    const checkFilters = () => {
        return Object.values(filters).includes(true);
    };
    const checkEqualObjects = () => {
        const val1 = Object.values(filters);
        const val2 = Object.values(filtersRK);
        if (val1.length != val2.length) {
            return false;
        }
        for (let i = 0; i < val1.length; i++) {
            if (val1[i] != val2[i]) return false;
        }
        return true;
    };

    const checkboxes = () => {
        const names = {
            scheduleRules: 'показать РК без графика',
            budgetRules: 'показать РК без бюджета',
            phrasesRules: 'показать РК без управления фразами',
            bidderRules: 'показать РК без автоставок',
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
        <div>
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
                            background: '#221d220f',
                            // boxShadow: '#0006 0px 2px 8px 0px',
                            border: '1px solid #eee2',
                            borderRadius: '0px 0px 8px 8px',
                            position: 'absolute',
                            left: -296,
                            top: -3,
                            width: 300,
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
                        <Button
                            view="action"
                            style={{marginTop: '0px', marginBottom: '8px'}}
                            disabled={isFiltersSame}
                            onClick={() => {
                                setFilters(filtersRK);
                                setShowPopup(false);
                            }}
                        >
                            <Text>Установить фильтр</Text>
                        </Button>
                    </div>
                </div>
            </Popup>
            <Button
                style={{marginLeft: 5, alignItems: 'center', justifyContent: 'center'}}
                // size="l"
                ref={ref}
                view="outlined"
                onClick={() => {
                    setShowPopup(!showPopup);
                }}
            >
                <Text color={checkFilters() ? 'warning' : undefined}>
                    <div style={{height: '6px'}}></div>
                    <Icon data={ListCheck} size={16} />
                </Text>
            </Button>
        </div>
    );
};
