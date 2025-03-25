import {Button, Icon, Link, SegmentedRadioGroup, Text, useTheme} from '@gravity-ui/uikit';
import {Rocket, Magnifier, ArrowRight} from '@gravity-ui/icons';
import React, {
    Children,
    cloneElement,
    CSSProperties,
    isValidElement,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import ApiClient from '@/utilities/ApiClient';
import {ModalWindow} from '@/shared/ui/Modal';
import TheTable, {compare} from '@/components/TheTable';
import {getRoundValue} from '@/utilities/getRoundValue';

interface AuctionProps {
    sellerId: string;
    phrase: any;
    children: any;
}

export const Auction = ({children, sellerId, phrase}: AuctionProps) => {
    const initialTheme: string = useTheme();

    const auctionOptions: any[] = [
        {value: 'firstPage', content: 'Выдача'},
        {value: 'auto', content: 'Аукцион Авто'},
        {value: 'search', content: 'Аукцион Поиска'},
    ];
    const [auctionSelectedOption, setAuctionSelectedOption] = useState('firstPage');
    const [auction, setAuction] = useState([]);
    const [auctionFiltered, setAuctionFiltered] = useState([] as any[]);
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({} as any);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        getAuction();
    }, [auctionSelectedOption]);

    useEffect(() => {
        if (!open) setAuction([]);
        else {
            getAuction();
            setAuctionSelectedOption(String('firstPage'));
        }
    }, [open]);

    const getAuction = useCallback(async () => {
        if (!open) return;

        try {
            const response = await ApiClient.post('massAdvert/get-auction', {
                seller_id: sellerId,
                type: auctionSelectedOption,
                phrase,
            });

            const {data} = response ?? {};
            if (!data) throw new Error('No data.');

            setAuction(data);
        } catch (error) {
            console.error('error auction', error);
        }
    }, [sellerId, phrase, auctionOptions]);

    useEffect(() => {
        filterTableData(filters, auction);
    }, [auction, filters]);

    const filterByButton = (val: any, key = 'nmId', compMode = 'include') => {
        filters[key] = {val: String(val), compMode: compMode};
        setFilters({...filters});
        filterTableData(filters);
    };

    const columnDataAuction = [
        {
            placeholder: '#',
            name: 'index',
            sortable: false,
            render: ({index, footer}: any) => {
                const displayIndex = index + 1;
                return footer ? undefined : (
                    <Button width="max" size="xs" view="flat">
                        {displayIndex}
                    </Button>
                );
            },
        },
        {
            placeholder: 'Ставка',
            name: 'cpm',
            render: ({value, row}: any) => {
                const {advertsType} = row;
                if (!value) return undefined;
                return (
                    <Button size="xs" view="flat">
                        {advertsType ? (
                            <Icon data={advertsType == 'auto' ? Rocket : Magnifier} size={11} />
                        ) : (
                            <></>
                        )}
                        {value as number}
                    </Button>
                );
            },
        },
        {
            placeholder: 'Позиция',
            name: 'promoPosition',
            render: ({value, row}: any) => {
                if (value === undefined) return;
                const {position} = row;
                const displayIndex = (value as number) + 0;
                return (
                    <Button size="xs" view="flat">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text color="secondary">{`${position + 1}`}</Text>
                            <div style={{width: 3}} />
                            <Icon data={ArrowRight} size={13}></Icon>
                            <div style={{width: 3}} />
                            <Text>{`${displayIndex}`}</Text>
                        </div>
                    </Button>
                );
            },
        },
        {
            placeholder: 'Бренд',
            name: 'brand',
            valueType: 'text',
            render: ({value, row}: any) => {
                if (!value) return undefined;
                const {id} = row;
                return (
                    <Link
                        view="primary"
                        style={{whiteSpace: 'pre-wrap'}}
                        href={`https://www.wildberries.ru/catalog/${id}/detail.aspx?targetUrl=BP`}
                        target="_blank"
                    >
                        <Text variant="subheader-1">{value as string}</Text>
                    </Link>
                );
            },
        },
        {
            placeholder: 'Цена с СПП, ₽',
            name: 'sppPrice',
        },
        {
            placeholder: 'Буст на',
            name: 'boost',
        },
        {
            placeholder: 'Цена 1 буста, ₽',
            name: 'avgBoostPrice',
        },
        {
            valueType: 'text',
            placeholder: 'Акция',
            name: 'promoTextCard',
        },
    ] as any;

    const filterTableData = (withfFilters: any = {}, tableData: any = {}) => {
        const temp = [] as any;

        for (const [art, artInfo] of Object.entries(
            Object.keys(tableData).length ? tableData : auction,
        )) {
            if (!art || !artInfo) continue;

            const tempTypeRow: any = artInfo;

            let addFlag = true;
            const useFilters: any = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, filterData] of Object.entries(useFilters)) {
                if (filterArg == 'undef' || !filterData) continue;
                if ((filterData as any)['val'] == '') continue;

                const fldata = (filterData as any)['val'];
                const flarg = tempTypeRow[filterArg];

                if (fldata.trim() == '+') {
                    if (flarg !== undefined) continue;
                } else if (fldata.trim() == '-') {
                    if (flarg === undefined) continue;
                }

                if (!compare(tempTypeRow[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }

            tempTypeRow.boost =
                (tempTypeRow?.position ?? 0) - (tempTypeRow?.promoPosition ?? 0) + 2;

            if (addFlag) {
                temp.push(tempTypeRow);
            }
        }

        setAuctionFiltered([...temp]);
    };

    useEffect(() => {
        if (!open) return;
        setTimeout(() => {
            setFilters({});
        }, 1000);
    }, [open]);

    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    const [brandMap, setBrandMap] = useState({} as any);

    const footerData = useMemo(() => {
        const temp = {
            index: `${auctionSelectedOption}, ${auctionFiltered ? auctionFiltered.length : 0} шт.`,
            promoTextCard: 0,
            brand: 0,
            boost: 0,
            avgBoostPrice: 0,
            sppPrice: 0,
            cpm: 0,
        };
        const tempBrandMap = {} as any;
        for (const row of auctionFiltered) {
            const {brand, promoTextCard, boost, avgBoostPrice, sppPrice, cpm} = row;
            if (brand) {
                if (!tempBrandMap[brand]) tempBrandMap[brand] = 0;
                tempBrandMap[brand]++;
            }
            if (promoTextCard?.length) temp.promoTextCard++;
            temp.boost += boost ?? 0;
            temp.avgBoostPrice += avgBoostPrice ?? 0;
            temp.sppPrice += sppPrice ?? 0;
            temp.cpm += cpm ?? 0;
        }

        temp.brand = Object.keys(tempBrandMap).length;

        temp.boost = getRoundValue(temp.boost, auctionFiltered.length);
        temp.avgBoostPrice = getRoundValue(temp.avgBoostPrice, auctionFiltered.length);
        temp.sppPrice = getRoundValue(temp.sppPrice, auctionFiltered.length);
        temp.cpm = getRoundValue(temp.cpm, auctionFiltered.length);

        setBrandMap(tempBrandMap);
        return temp;
    }, [auctionFiltered]);

    const brandList = useMemo(() => {
        return Object.entries(brandMap)
            .sort((a: any, b: any) => b[1] - a[1])
            .map(([brand, count]: any) => (
                <Text
                    onClick={() => filterByButton(brand, 'brand')}
                    style={{textWrap: 'nowrap', cursor: 'pointer'}}
                >
                    <Text ellipsis style={{maxWidth: 200}}>
                        {brand}
                    </Text>{' '}
                    {`${getRoundValue(count, auctionFiltered.length, true)}%`}
                </Text>
            ));
    }, [brandMap]);

    return (
        <>
            {triggerButton}
            <ModalWindow isOpen={open} handleClose={handleClose}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        gap: 12,
                        height: '80vh',
                        width: '70vw',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                        }}
                    >
                        <Text variant="header-1">Доли брендов</Text>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'auto',
                                gap: 12,
                            }}
                        >
                            {brandList}
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                        }}
                    >
                        <SegmentedRadioGroup
                            size="l"
                            value={auctionSelectedOption}
                            options={auctionOptions}
                            onUpdate={(value) => {
                                setAuctionSelectedOption(value);
                            }}
                        />
                        <div
                            style={
                                {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    height: '100%',
                                    width: '100%',
                                    '--g-color-base-background':
                                        initialTheme === 'dark' ? 'rgba(14, 14, 14, 1)' : '#eeee',
                                } as CSSProperties
                            }
                        >
                            <TheTable
                                footerData={[footerData]}
                                columnData={columnDataAuction}
                                data={auctionFiltered}
                                tableId={'auction'}
                                usePagination={false}
                                filters={filters}
                                height={'100%'}
                                setFilters={setFilters}
                                filterData={filterTableData}
                            />
                        </div>
                    </div>
                </div>
            </ModalWindow>
        </>
    );
};
