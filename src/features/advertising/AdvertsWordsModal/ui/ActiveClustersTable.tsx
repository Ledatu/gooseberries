'use client';

import TheTable from '@/components/TheTable';
import {useAdvertsWordsModal} from '../hooks/AdvertsWordsModalContext';
import {clusterDataMap, ClusterData} from '../api/mapper';
import {Button, Icon, Text} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import {LogoLoad} from '@/components/logoLoad';
import {useState} from 'react';
import {Cherry} from '@gravity-ui/icons';
import {AnimatedLogo} from '@/components/AnimatedLogo';
import {useClustersTableContext} from '../hooks/ClustersTableContext';
import {renderGradNumber} from '@/utilities/renderGradNumber';
import {defaultRender} from '@/utilities/getRoundValue';

export interface ColumnData {
    placeholder: string;
    name: string;
    value?: string;
    constWidth?: number;
    render?: (data: any) => React.ReactNode;
}

const columnData: ColumnData[] = [
    {
        placeholder: 'Пресет',
        name: 'preset',
        value: 'text',
        constWidth: 100,
        render: ({value}: any) => {
            return (
                <div>
                    <Button
                        size="xs"
                        view={'flat'}
                        onClick={
                            () => {}
                            // filterByButtonClusters(value, true, 'preset', 'include')
                        }
                    >
                        <Text color="primary">{value}</Text>
                    </Button>
                </div>
            );
        },
    },
    {
        placeholder: 'Кластер',
        name: 'cluster',
        value: 'text',
        render: ({value}: any) => {
            return (
                <div>
                    <Button
                        size="xs"
                        view={'flat'}
                        onClick={
                            () => {}
                            // filterByButtonClusters(value, true, 'preset', 'include')
                        }
                    >
                        <Text color="primary">{value}</Text>
                    </Button>
                </div>
            );
        },
    },
    {
        placeholder: 'Показы, шт',
        name: 'views',
        value: 'number',
        render: ({value, }) => {
            // renderGradNumber(value, footer[0]['views'], defaultRender);
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'Клики, шт',
        name: 'clicks',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'CTR, %',
        name: 'ctr',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },

    {
        placeholder: 'CPC, ₽',
        name: 'cpc',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'Расход, ₽',
        name: 'totalSum',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'Частота, шт',
        name: 'totalFrequency',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'Переходы, шт',
        name: 'openCardCurrent',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'CR в корзину, %',
        name: 'openToCartCurrent',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'CR в заказ, %',
        name: 'cartToOrderCurrent',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'CR, %',
        name: 'openToOrderPercent',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'В корзину, шт',
        name: 'addToCartCurrent',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },

    {
        placeholder: 'Заказов, шт',
        name: 'ordersCurrent',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
    {
        placeholder: 'Средняя позиция, шт',
        name: 'avgPositionCurrent',
        value: 'number',
        render: ({value}) => {
            return (
                <div>
                    <Text>{value}</Text>
                </div>
            );
        },
    },
];

export const ActiveClustersTable = () => {
    const {stats, loading} = useAdvertsWordsModal();

    const {data, footer, columns, showDzhem, setShowDzhem} = useClustersTableContext(columnData);
    const toglleDzhemButton = () => {
        setShowDzhem(!showDzhem);
    };

    return (
        <div style={{margin: 8, display: 'flex', flexDirection: 'column'}}>
            <div style={{}}>
                <Button
                    view={showDzhem ? 'action' : 'outlined'}
                    size="l"
                    onClick={toglleDzhemButton}
                >
                    <Icon data={Cherry} />
                </Button>
            </div>
            {loading ? (
                <motion.div animate={{opacity: loading ? 1 : 0}}>
                    <AnimatedLogo />
                </motion.div>
            ) : (
                <TheTable
                    data={stats}
                    tableId="ActiveClustersTable"
                    usePagination={true}
                    defaultPaginationSize={100}
                    columnData={columns}
                    filters={[]}
                    footerData={[footer]}
                    setFilters={() => {}}
                    filterData={stats}
                    height={600}
                />
            )}
        </div>
    );
};
