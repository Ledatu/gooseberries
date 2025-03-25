import {AdvertCreateModal} from '@/features/advertising/AdvertCreationModal';
import {Button, Card, Icon, Popover, Text} from '@gravity-ui/uikit';
import {ChartLine, CircleRuble, Clock, Play, SlidersVertical} from '@gravity-ui/icons';
import {AdvertsStatusManagingModal} from '@/components/Pages/MassAdvertPage/AdvertsStatusManagingModal';
import {AdvertsBidsModal} from '@/components/Pages/MassAdvertPage/AdvertsBidsModal';
import {AdvertsBudgetsModal} from '@/components/Pages/MassAdvertPage/AdvertsBudgetsModal';
import {PhrasesModal} from '@/components/Pages/MassAdvertPage/PhrasesModal';
import {AdvertsSchedulesModal} from '@/components/Pages/MassAdvertPage/AdvertsSchedulesModal';
import {TagsFilterModal} from '@/components/TagsFilterModal';
import {AutoSalesModal} from '@/components/Pages/MassAdvertPage/AutoSalesModal';
import ChartKit from '@gravity-ui/chartkit';
import {FC} from 'react';

interface ButtonsListProps {
    doc: any;
    filteredData: any;
    setChangedDoc: any;
    permission: any;
    getUniqueAdvertIdsFromThePage: any;
    selectValue: any;
    sellerId: any;
    advertBudgetRules: any;
    setAdvertBudgetRules: any;
    setAutoSalesModalOpenFromParent: any;
    getBalanceYagrData: any;
    balance: any;
    filterByButton: any;
    setAutoSalesProfits: any;
    autoSalesModalOpenFromParent: any;
    setUpdatePaused: any;
}

export const ButtonsList: FC<ButtonsListProps> = ({
    doc,
    filteredData,
    setChangedDoc,
    permission,
    getUniqueAdvertIdsFromThePage,
    selectValue,
    sellerId,
    advertBudgetRules,
    setAdvertBudgetRules,
    setAutoSalesModalOpenFromParent,
    getBalanceYagrData,
    balance,
    filterByButton,
    setAutoSalesProfits,
    autoSalesModalOpenFromParent,
    setUpdatePaused,
}) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: 8,
                rowGap: 8,
            }}
        >
            <AdvertCreateModal doc={doc} filteredData={filteredData} setChangedDoc={setChangedDoc}>
                <Button disabled={permission != 'Управление'} view="action" size="l">
                    <Icon data={SlidersVertical} />
                    <Text variant="subheader-1">Создать</Text>
                </Button>
            </AdvertCreateModal>
            <div style={{minWidth: 8}} />
            <AdvertsStatusManagingModal
                disabled={permission != 'Управление'}
                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                doc={doc}
                setChangedDoc={setChangedDoc}
                setUpdatePaused={setUpdatePaused}
            >
                <Button
                    disabled={permission != 'Управление'}
                    view="action"
                    size="l"
                    style={{cursor: 'pointer'}}
                >
                    <Icon data={Play} />
                    <Text variant="subheader-1">Управление</Text>
                </Button>
            </AdvertsStatusManagingModal>
            <div style={{minWidth: 8}} />
            <AdvertsBidsModal
                disabled={permission != 'Управление'}
                selectValue={selectValue}
                doc={doc}
                setChangedDoc={setChangedDoc}
                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                advertId={undefined}
            >
                <Button view="action" size="l" disabled={permission != 'Управление'}>
                    <Icon data={ChartLine} />
                    <Text variant="subheader-1">Ставки</Text>
                </Button>
            </AdvertsBidsModal>
            <div style={{minWidth: 8}} />
            <AdvertsBudgetsModal
                disabled={permission != 'Управление'}
                selectValue={selectValue}
                sellerId={sellerId}
                advertBudgetsRules={advertBudgetRules}
                setAdvertBudgetsRules={setAdvertBudgetRules}
                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
                advertId={undefined}
            >
                <Button view="action" size="l" disabled={permission != 'Управление'}>
                    <Icon data={CircleRuble} />
                    <Text variant="subheader-1">Бюджет</Text>
                </Button>
            </AdvertsBudgetsModal>
            <div style={{minWidth: 8}} />
            <PhrasesModal
                disabled={permission != 'Управление'}
                doc={doc}
                setChangedDoc={setChangedDoc}
                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
            />
            <div style={{minWidth: 8}} />
            <AdvertsSchedulesModal
                disabled={permission != 'Управление'}
                doc={doc}
                setChangedDoc={setChangedDoc}
                advertId={undefined as any}
                getUniqueAdvertIdsFromThePage={getUniqueAdvertIdsFromThePage}
            >
                <Button disabled={permission != 'Управление'} view="action" size="l">
                    <Icon data={Clock} />
                    <Text variant="subheader-1">График</Text>
                </Button>
            </AdvertsSchedulesModal>
            <div style={{minWidth: 8}} />
            <TagsFilterModal filterByButton={filterByButton} />
            <div style={{minWidth: 8}} />
            <AutoSalesModal
                disabled={permission != 'Управление'}
                selectValue={selectValue}
                filteredData={filteredData}
                setAutoSalesProfits={setAutoSalesProfits}
                sellerId={sellerId}
                openFromParent={autoSalesModalOpenFromParent}
                setOpenFromParent={setAutoSalesModalOpenFromParent}
            />
            <div style={{minWidth: 8}} />
            <Popover
                enableSafePolygon={true}
                openDelay={500}
                // closeDelay={50000}
                placement={'bottom'}
                content={
                    <div
                        style={{
                            height: 'calc(30em)',
                            width: '60em',
                            overflow: 'auto',
                            display: 'flex',
                        }}
                    >
                        <Card
                            view="outlined"
                            theme="warning"
                            style={{
                                // position: 'absolute',
                                height: '30em',
                                width: '60em',
                                overflow: 'auto',
                                top: -10,
                                left: -200,
                                display: 'flex',
                            }}
                        >
                            <ChartKit type="yagr" data={getBalanceYagrData()} />
                        </Card>
                    </div>
                }
            >
                <Button view="outlined-success" size="l">
                    <Text variant="subheader-1">{balance}</Text>
                </Button>
            </Popover>
        </div>
    );
};
