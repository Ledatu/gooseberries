import {Button, Card, Icon, Link, Popover, SegmentedRadioGroup, Text} from '@gravity-ui/uikit';
import {Rocket, Magnifier, ArrowRight} from '@gravity-ui/icons';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import DataTable, {Column} from '@gravity-ui/react-data-table';
import {MOVING} from '@gravity-ui/react-data-table/build/esm/lib/constants';
import ApiClient from '@/utilities/ApiClient';

interface AuctionProps {
    sellerId: string;
    phrase: any;
}

export const Auction = ({sellerId, phrase}: AuctionProps) => {
    const auctionOptions: any[] = [
        {value: 'firstPage', content: 'Выдача'},
        {value: 'auto', content: 'Аукцион Авто'},
        {value: 'search', content: 'Аукцион Поиска'},
    ];
    const [auctionSelectedOption, setAuctionSelectedOption] = useState('firstPage');
    const [auction, setAuction] = useState([]);
    const [open, setOpen] = useState(false);

    // const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);

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

    const columnDataAuction = useMemo(
        () => [
            {
                header: '#',
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
                header: 'Ставка',
                name: 'cpm',
                render: ({value, row, footer}: any) => {
                    const {advertsType} = row;
                    if (footer || !value) return undefined;
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
                header: 'Позиция',
                name: 'promoPosition',
                render: ({value, row}) => {
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
                header: 'Бренд',
                name: 'brand',
                render: ({value, row}) => {
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
                header: 'Цена с СПП, ₽',
                name: 'sppPrice',
            },
            {
                header: 'Цена 1 буста, ₽',
                name: 'avgBoostPrice',
            },
            {
                header: 'Акция',
                name: 'promoTextCard',
            },
        ],
        [],
    );

    return (
        <div>
            <Popover
                enableSafePolygon={true}
                onOpenChange={(val) => {
                    setOpen(val);
                }}
                placement={'bottom-start'}
                // disablePortal={true}
                // disableOutsideClickClose
                closeDelay={1000}
                // content={
                //     <div>
                //     <Card style={{width: 400, height: 500}}>
                //         <Text>Попа</Text>
                //     </Card>
                //     </div>
                // }
                // style={{width: 200, height: 200}}
                content={
                    // <Card
                    //     style={{
                    //         // backdropFilter: 'blur(20px)',
                    //         // borderRadius: 30,
                    //         // boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                    //         // width: 'max-content',
                    //         // height: 'max-content',

                    //         overflow: 'auto',
                    //         display: 'flex',
                    //     }}
                    // >
                    <Card
                        // view="clear"
                        style={{
                            // width: 'max-content',
                            // height: 'max-content',
                            position: 'absolute',
                            maxHeight: '42em',
                            display: 'flex',
                            padding: 16,
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            boxShadow: '#0002 0px 2px 8px 0px',
                            // padding: 30,
                            borderRadius: 16,
                            border: '1px solid #eee2',
                            flexDirection: 'row',
                            top: -10,
                            left: -10,
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                            <SegmentedRadioGroup
                                size="l"
                                value={auctionSelectedOption}
                                options={auctionOptions}
                                onUpdate={(value) => {
                                    setAuctionSelectedOption(value);
                                }}
                            />
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Card
                                    style={{
                                        background: 'var(--gc-color-base-background)',
                                        maxWidth: '80em',
                                        maxHeight: '30em',
                                        height: 'fit-content',
                                        overflow: 'auto',
                                        boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
                                    }}
                                >
                                    {/* <Card
                                        style={{
                                            background: 'var(--g-color-base-background)',
                                        }}
                                    > */}
                                    <DataTable
                                        settings={{
                                            displayIndices: false,
                                            stickyHead: MOVING,
                                            stickyFooter: MOVING,
                                            highlightRows: true,
                                        }}
                                        footerData={[
                                            {
                                                cpm: `${auctionSelectedOption}, ${
                                                    auction ? auction.length : 0
                                                } шт.`,
                                            },
                                        ]}
                                        theme="yandex-cloud"
                                        columns={columnDataAuction as Column<any>[]}
                                        data={auction}
                                    />
                                </Card>
                                {/* </Card> */}
                            </div>
                        </div>
                    </Card>
                    // </Card>
                }
            >
                <div>
                    <Text>{phrase}</Text>
                </div>
            </Popover>
        </div>
    );
};
