'use client';
import {
    Icon,
    Select,
    SelectOption,
    Tab,
    TabProvider,
    Text,
    // useTheme,
} from '@gravity-ui/uikit';
import {ChevronDown} from '@gravity-ui/icons';
import {CSSProperties, ReactElement, Ref, useEffect, useMemo, useRef, useState} from 'react';
// import {useModules} from '@/contexts/ModuleProvider';
import {motion} from 'framer-motion';
import {TabsItemProps, CustomTabsProps} from './types';

// import {useRouter} from 'next/router';

// export interface TabsItemProps {
//     value?: string;
//     title: string;
//     href: string;
//     id?: string;
// }

export const CustomTabs = ({items, setModule, currentModule}: CustomTabsProps) => {
    // const theme = useTheme();
    const tabsRef = useRef<HTMLDivElement | null>(null);
    const [visibleTabs, setVisibleTabs] = useState<ReactElement[]>([]);
    const [hiddenTabs, setHiddenTabs] = useState<TabsItemProps[]>([]);
    const [selectObjectFromTab, _setSelectObjectFromTab] = useState({} as any);
    // const {setModule, currentModule} = useModules();
    const [valueOfTab, setValueOfTab] = useState<string | null>(null);
    useEffect(() => {
        if (currentModule) {
            setValueOfTab(currentModule);
        }
    }, [currentModule]);

    useEffect(() => {
        if (!tabsRef.current || !items) return;

        const resizeObserver = new ResizeObserver(() => {
            updateVisibleTabs();
        });

        resizeObserver.observe(tabsRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [items?.length, currentModule, valueOfTab]); // ✅ Now runs only when `items.length` changes

    const updateVisibleTabs = () => {
        if (!tabsRef.current || !items) return;

        const containerWidth = tabsRef.current.offsetWidth - 102; // Adjust padding/margins
        let currentWidth = 0;
        const newVisibleTabs: ReactElement[] = [];
        const newHiddenTabs: TabsItemProps[] = [];
        let flag = false;

        items.forEach((item: any, index) => {
            // Measure tab width
            const tempElement = document.createElement('text');
            tempElement.style.position = 'absolute';
            tempElement.style.visibility = 'hidden';
            tempElement.style.whiteSpace = 'nowrap';
            tempElement.style.fontSize = 'var(--g-text-body-3-font-size)';
            // tempElement.style.fontSize = 'var(--g-text-body-3-font-size)';
            tempElement.innerText = item.title as string;
            document.body.appendChild(tempElement);

            const itemWidth = tempElement.offsetWidth + 24; // Account for padding/margins
            document.body.removeChild(tempElement);

            if (currentWidth + itemWidth < containerWidth && !flag) {
                console.log(item.id, valueOfTab);
                newVisibleTabs.push(
                    <Tab key={index} value={item.id} title={item.title} disabled={item.disabled}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                height: 60,
                                // top: item.id === activeTab ? '-5px' : undefined,
                                // borderBottom:
                                //     item.id === valueOfTab ? '5px solid #ffbe5c' : undefined,
                            }}
                        >
                            <Text variant="body-3" color={item.disabled ? 'secondary' : 'primary'}>
                                {item.title}
                            </Text>
                        </div>
                        {item.id === valueOfTab ? (
                            <motion.div
                                layoutId="current-tab"
                                style={{borderBottom: '5px solid #ffbe5c'}}
                            ></motion.div>
                        ) : (
                            <motion.div style={{borderBottom: '5px solid #00000000'}}></motion.div>
                        )}
                        <motion.div></motion.div>
                    </Tab>,
                );
                currentWidth += itemWidth;
            } else {
                newHiddenTabs.push(item);
                flag = true;
                return undefined;
            }
        });

        setVisibleTabs((prev) => (prev === newVisibleTabs ? prev : newVisibleTabs));
        setHiddenTabs((prev) => (prev === newHiddenTabs ? prev : newHiddenTabs));
    };

    const notShowingOptions = useMemo(() => {
        if (hiddenTabs.length === 0) return [];
        return hiddenTabs.map(
            (tab) => ({text: tab.title, data: tab.id as string}) as SelectOption<string>,
        );
    }, [hiddenTabs]); // ✅ Memoized with stable reference'

    const handleUpdateTabs = (value: string) => {
        console.log(value);
        setValueOfTab(value);
        if (value === 'more') {
        } else {
            setModule(value);
        }
    };

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center', // Align items in a single row
                width: '100%', // Ensure it stretches across the container
                // boxShadow: `inset 0px -9px 0px -8px ${theme === 'dark' ? '#2d2c33' : '#fff'}`,
            }}
        >
            {/* Tabs Container */}
            <div
                ref={tabsRef}
                style={
                    {
                        display: 'flex',
                        flexGrow: 1, // Allow tabs to take up available space
                        overflow: 'hidden',
                        gap: '16px', // Prevent tabs from overflowing
                        marginInline: 8,
                    } as CSSProperties
                }
            >
                <TabProvider
                    value={valueOfTab ? valueOfTab : ''}
                    key={'CommonTab'}
                    onUpdate={(value: string) => {
                        handleUpdateTabs(value);
                    }}
                >
                    {visibleTabs}
                    {notShowingOptions.length !== 0 && (
                        <Tab value="more">
                            <div>
                                <Select
                                    // open={true}
                                    options={notShowingOptions}
                                    renderOption={(option) => {
                                        const currentItem: any = items?.filter(
                                            (item) => item.id == option.data,
                                        )[0];
                                        return (
                                            <Text
                                                onClick={() => {
                                                    console.log(currentItem.id);
                                                    setModule(currentItem?.id);
                                                    setValueOfTab('more');
                                                }}
                                                style={{width: '100%', height: '100%'}}
                                                variant="body-3"
                                                color={
                                                    currentItem?.disabled ? 'secondary' : undefined
                                                }
                                            >
                                                {currentItem?.title}
                                            </Text>
                                        );
                                    }}
                                    renderControl={({triggerProps: {onClick, onKeyDown}, ref}) => (
                                        <div
                                            style={
                                                {
                                                    '--gc-button-background-color-hover': 'none',
                                                    height: 60,
                                                    width: 80,
                                                    textOverflow: 'ellipsis',
                                                    background: 'transparent',
                                                    borderBottom:
                                                        'more' === valueOfTab
                                                            ? '5px solid #ffbe5c'
                                                            : '5px solid #0000',
                                                    scrollbarColor:
                                                        'var(--g-color-scroll-handle) var(--g-color-scroll-track)',
                                                    scrollbarWidth: 'auto',
                                                    flexShrink: 0,
                                                    alignContent: 'center',
                                                    justifyItems: 'center',
                                                } as CSSProperties
                                            }
                                            ref={ref as Ref<HTMLDivElement>}
                                            onClick={onClick}
                                            onKeyDown={onKeyDown}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    // marginTop: 'px',
                                                }}
                                            >
                                                <Text variant="body-3" style={{marginRight: '4px'}}>
                                                    {selectObjectFromTab.title ||
                                                        `Еще · ${notShowingOptions.length}`}
                                                </Text>
                                                {notShowingOptions.length > 1 && (
                                                    <Icon data={ChevronDown} />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </Tab>
                    )}
                </TabProvider>
            </div>
        </div>
    );
};
