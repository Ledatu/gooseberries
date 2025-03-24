'use client';
import {Link, Text} from '@gravity-ui/uikit';
import {useEffect, useState} from 'react';
import {CopyButton} from '@/components/Buttons/CopyButton';
import {RangePicker} from '@/components/RangePicker';
import TheTable, {compare} from '@/components/TheTable';
import {useCampaign} from '@/contexts/CampaignContext';
import callApi from '@/utilities/callApi';
import {defaultRender, getRoundValue, renderAsPercent, renderDate} from '@/utilities/getRoundValue';

const renderTwoDigits = ({value}: any) => {
    return defaultRender({value: getRoundValue(value, 100, true)});
};

export const DetailedReportsPage = () => {
    const {setSwitchingCampaignsFlag, sellerId} = useCampaign();
    const columnData = [
        {
            name: 'realizationreport_id',
            placeholder: 'Номер отчёта',
            valueType: 'numberNoIntl',
            render: ({value, footer}: any) => {
                if (footer) return <div style={{height: 28}}>{value}</div>;

                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Link
                            view="primary"
                            style={{whiteSpace: 'pre-wrap'}}
                            href={`https://seller.wildberries.ru/suppliers-mutual-settlements/reports-implementations/reports-weekly-new/report/${value}?isGlobalBalance=false`}
                            target="_blank"
                        >
                            <Text variant="subheader-1">{value}</Text>
                        </Link>
                        <CopyButton copyText={value} size="xs" iconSize={13} view="flat" />
                    </div>
                );
            },
        },
        {name: 'date_from', placeholder: 'Начало', render: renderDate},
        {name: 'date_to', placeholder: 'Конец', render: renderDate},
        {name: 'create_dt', placeholder: 'Сформирован', render: renderDate},
        {
            name: 'retail_price_withdisc_rub',
            placeholder: 'Продажи',
            render: renderTwoDigits,
        },
        {name: 'retail_amount', placeholder: 'Продажи WB', render: renderTwoDigits},
        {
            name: 'sale_amount',
            placeholder: 'Скидки WB',
            render: ({row}: any) => {
                const {retail_price_withdisc_rub: ourPrice, retail_amount: retailAmount} = row;
                return renderTwoDigits({value: ourPrice - retailAmount});
            },
        },
        {
            name: 'sale_percent',
            placeholder: 'Скидки WB %',
            render: ({row}: any) => {
                const {retail_price_withdisc_rub: ourPrice, retail_amount: retailAmount} = row;
                return renderAsPercent({
                    value: 100 - getRoundValue(retailAmount, ourPrice, true),
                });
            },
        },
        // {name: 'retail_price', placeholder: 'Цена розничная'},
        // {
        //     name: 'commission_amount',
        //     placeholder: 'Комиссия WB',
        //     render: ({row}: any) => {
        //         const {ppvz_for_pay: ppvzForPay, retail_amount: retailAmount} = row;
        //         return renderTwoDigits({value: retailAmount - ppvzForPay});
        //     },
        // },
        // {
        //     name: 'commission_percent',
        //     placeholder: 'Комиссия WB %',
        //     render: ({row}: any) => {
        //         const {ppvz_for_pay: ppvzForPay, retail_amount: retailAmount} = row;
        //         return renderAsPercent({
        //             value: 100 - getRoundValue(ppvzForPay, retailAmount, true),
        //         });
        //     },
        // },
        {name: 'acquiring_fee', placeholder: 'Эквайринг', render: renderTwoDigits},
        {
            name: 'acquiring_percent',
            placeholder: 'Эквайринг %',
            render: ({row}: any) => {
                const {acquiring_fee: acquiringFee, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: getRoundValue(acquiringFee, ourPrice, true),
                });
            },
        },
        {
            name: 'all_commission_amount',
            placeholder: 'Итого Комиссия WB',
            render: ({row}: any) => {
                const {ppvz_for_pay: ppvzForPay, retail_price_withdisc_rub: ourPrice} = row;
                return renderTwoDigits({value: ourPrice - ppvzForPay});
            },
        },
        {
            name: 'all_commission_percent',
            placeholder: 'Итого Комиссия WB %',
            render: ({row}: any) => {
                const {ppvz_for_pay: ppvzForPay, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: 100 - getRoundValue(ppvzForPay, ourPrice, true),
                });
            },
        },
        {name: 'ppvz_for_pay', placeholder: 'К перечислению', render: renderTwoDigits},
        {name: 'delivery_rub', placeholder: 'Логистика', render: renderTwoDigits},
        {
            name: 'delivery_rub_percent',
            placeholder: 'Логистика %',
            render: ({row}: any) => {
                const {delivery_rub: deliveryRub, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: getRoundValue(deliveryRub, ourPrice, true),
                });
            },
        },
        {name: 'storage_fee', placeholder: 'Хранение', render: renderTwoDigits},
        {
            name: 'storage_fee_percent',
            placeholder: 'Хранение %',
            render: ({row}: any) => {
                const {storage_fee: storageFee, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: getRoundValue(storageFee, ourPrice, true),
                });
            },
        },
        {name: 'acceptance', placeholder: 'Приёмка', render: renderTwoDigits},
        {
            name: 'acceptance_percent',
            placeholder: 'Приёмка %',
            render: ({row}: any) => {
                const {acceptance, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: getRoundValue(acceptance, ourPrice, true),
                });
            },
        },
        {name: 'penalty', placeholder: 'Штрафы', render: renderTwoDigits},
        {
            name: 'penalty_percent',
            placeholder: 'Штрафы %',
            render: ({row}: any) => {
                const {penalty, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: getRoundValue(penalty, ourPrice, true),
                });
            },
        },
        {name: 'deduction', placeholder: 'Удержания', render: renderTwoDigits},
        {
            name: 'deduction_percent',
            placeholder: 'Удержания',
            render: ({row}: any) => {
                const {deduction, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: getRoundValue(deduction, ourPrice, true),
                });
            },
        },
        {
            name: 'earned',
            placeholder: 'Выплата',
            render: ({row}: any) => {
                const {
                    ppvz_for_pay: ppvzForPay,
                    delivery_rub: deliveryRub,
                    storage_fee: storageFee,
                    acceptance,
                    penalty,
                    deduction,
                } = row;
                return renderTwoDigits({
                    value: ppvzForPay - deliveryRub - storageFee - acceptance - penalty - deduction,
                });
            },
        },
        {
            name: 'earned_percent',
            placeholder: 'Выплата %',
            render: ({row}: any) => {
                const {
                    ppvz_for_pay: ppvzForPay,
                    delivery_rub: deliveryRub,
                    storage_fee: storageFee,
                    acceptance,
                    penalty,
                    deduction,
                    retail_price_withdisc_rub: ourPrice,
                } = row;
                const earned =
                    ppvzForPay - deliveryRub - storageFee - acceptance - penalty - deduction;
                return renderAsPercent({
                    value: getRoundValue(earned, ourPrice, true),
                });
            },
        },
        {name: 'tax', placeholder: 'Налог', render: renderTwoDigits},
        {
            name: 'tax_percent',
            placeholder: 'Налог %',
            render: ({row}: any) => {
                const {tax, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: getRoundValue(tax, ourPrice, true),
                });
            },
        },
        {name: 'expenses', placeholder: 'Доп. расход', render: renderTwoDigits},
        {
            name: 'expenses_percent',
            placeholder: 'Доп. расход %',
            render: ({row}: any) => {
                const {expenses, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: getRoundValue(expenses, ourPrice, true),
                });
            },
        },
        {name: 'primeCost', placeholder: 'Себестоимость', render: renderTwoDigits},
        {
            name: 'primeCost_percent',
            placeholder: 'Себестоимость %',
            render: ({row}: any) => {
                const {primeCost, retail_price_withdisc_rub: ourPrice} = row;
                return renderAsPercent({
                    value: getRoundValue(primeCost, ourPrice, true),
                });
            },
        },
        {
            name: 'profit',
            placeholder: 'Прибыль',
            render: ({row}: any) => {
                const {
                    ppvz_for_pay: ppvzForPay,
                    delivery_rub: deliveryRub,
                    storage_fee: storageFee,
                    acceptance,
                    penalty,
                    deduction,
                    tax,
                    expenses,
                    primeCost,
                } = row;
                const earned =
                    ppvzForPay - deliveryRub - storageFee - acceptance - penalty - deduction;
                return renderTwoDigits({
                    value: earned - tax - expenses - primeCost,
                });
            },
        },
        {
            name: 'rentSales',
            placeholder: 'Прибыль % к продажам',
            render: ({row}: any) => {
                const {
                    ppvz_for_pay: ppvzForPay,
                    delivery_rub: deliveryRub,
                    storage_fee: storageFee,
                    acceptance,
                    penalty,
                    deduction,
                    tax,
                    expenses,
                    primeCost,
                    retail_price_withdisc_rub: ourPrice,
                } = row;
                const earned =
                    ppvzForPay - deliveryRub - storageFee - acceptance - penalty - deduction;
                const profit = earned - tax - expenses - primeCost;
                return renderAsPercent({
                    value: getRoundValue(profit, ourPrice, true),
                });
            },
        },
        {
            name: 'rentPrimeCost',
            placeholder: 'Прибыль % к себестоимости',
            render: ({row}: any) => {
                const {
                    ppvz_for_pay: ppvzForPay,
                    delivery_rub: deliveryRub,
                    storage_fee: storageFee,
                    acceptance,
                    penalty,
                    deduction,
                    tax,
                    expenses,
                    primeCost,
                } = row;
                const earned =
                    ppvzForPay - deliveryRub - storageFee - acceptance - penalty - deduction;
                const profit = earned - tax - expenses - primeCost;
                return renderAsPercent({
                    value: getRoundValue(profit, primeCost, true),
                });
            },
        },

        // {name: 'currency_name', placeholder: 'Валюта отчёта'},
        // {name: 'suppliercontract_code', placeholder: 'Договор'},
        // {name: 'rrd_id', placeholder: 'Номер строки'},
        // {name: 'gi_id', placeholder: 'Номер поставки'},
        // {name: 'subject_name', placeholder: 'Предмет'},
        // {name: 'nm_id', placeholder: 'Артикул WB'},
        // {name: 'brand_name', placeholder: 'Бренд'},
        // {name: 'sa_name', placeholder: 'Артикул продавца'},
        // {name: 'ts_name', placeholder: 'Размер'},
        // {name: 'barcode', placeholder: 'Баркод'},
        // {name: 'doc_type_name', placeholder: 'Тип документа'},
        // {name: 'quantity', placeholder: 'Количество'},
        // {name: 'sale_percent', placeholder: '% Согл. скидки'},
        // {name: 'office_name', placeholder: 'Склад'},
        // {name: 'supplier_oper_name', placeholder: 'Обоснование для оплаты'},
        // {name: 'order_dt', placeholder: 'Дата заказа'},
        // {name: 'sale_dt', placeholder: 'Дата продажи'},
        // {name: 'rr_dt', placeholder: 'Дата операции'},
        // {name: 'shk_id', placeholder: 'Штрих-код'},
        // {name: 'delivery_amount', placeholder: 'Доставки'},
        // {name: 'return_amount', placeholder: 'Возвраты'},
        // {name: 'gi_box_type_name', placeholder: 'Тип коробов'},
        // {name: 'product_discount_for_report', placeholder: 'Согласованный продуктовый дисконт'},
        // {name: 'supplier_promo', placeholder: 'Промокод'},
        // {name: 'rid', placeholder: 'Уникальный идентификатор заказа'},
        // {name: 'ppvz_spp_prc', placeholder: '% СПП'},
        // {name: 'ppvz_kvw_prc_base', placeholder: 'Размер кВВ без НДС, % базовый'},
        // {name: 'ppvz_kvw_prc', placeholder: 'Итоговый кВВ без НДС, %'},
        // {name: 'sup_rating_prc_up', placeholder: 'Размер снижения кВВ из-за рейтинга'},
        // {name: 'is_kgvp_v2', placeholder: 'Размер снижения кВВ из-за акции'},
        // {
        //     name: 'ppvz_sales_commission',
        //     placeholder: 'Вознаграждение с продаж до вычета услуг поверенного, без НДС',
        // },
        // {name: 'ppvz_reward', placeholder: 'Возмещение за выдачу и возврат товаров на ПВЗ'},
        // {name: 'acquiring_percent', placeholder: 'Размер комиссии за эквайринг без НДС, %'},
        // {name: 'acquiring_bank', placeholder: 'Наименование банка-эквайера'},
        // {name: 'ppvz_vw', placeholder: 'Вознаграждение WB без НДС'},
        // {name: 'ppvz_vw_nds', placeholder: 'НДС с вознаграждения WB'},
        // {name: 'ppvz_office_id', placeholder: 'Номер офиса'},
        // {name: 'ppvz_office_name', placeholder: 'Наименование офиса доставки'},
        // {name: 'ppvz_supplier_id', placeholder: 'Номер партнера'},
        // {name: 'ppvz_supplier_name', placeholder: 'Партнер'},
        // {name: 'ppvz_inn', placeholder: 'ИНН партнера'},
        // {name: 'declaration_number', placeholder: 'Номер таможенной декларации'},
        // {name: 'bonus_type_name', placeholder: 'Обоснование штрафов и доплат'},
        // {name: 'sticker_id', placeholder: 'Цифровое значение стикера'},
        // {name: 'site_country', placeholder: 'Страна продажи'},
        // {name: 'penalty', placeholder: 'Штрафы'},
        // {name: 'additional_payment', placeholder: 'Доплаты'},
        // {name: 'rebill_logistic_cost', placeholder: 'Возмещение издержек по перевозке'},
        // {name: 'rebill_logistic_org', placeholder: 'Организатор перевозки'},
        // {name: 'kiz', placeholder: 'Код маркировки'},
        // {name: 'srid', placeholder: 'Уникальный идентификатор заказа'},
        // {name: 'report_type', placeholder: 'Тип отчёта'},
    ] as any[];
    const [filters, setFilters] = useState({undef: false});
    const [data, setData] = useState([] as any[]);

    const yesterday = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 30);
    const [dateRange, setDateRange] = useState([weekAgo, yesterday]);

    const getSumarizedReports = async () => {
        setSwitchingCampaignsFlag(true);
        if (sellerId == '') setData([]);
        const params = {seller_id: sellerId, dateRange};
        console.log(params);
        const sumarizedReportsTemp = await callApi('getSumarizedReports', params).catch((e) => {
            console.log(e);
        });
        console.log('getSumarizedReports', params, sumarizedReportsTemp);
        if (sumarizedReportsTemp && sumarizedReportsTemp['data'])
            setData(sumarizedReportsTemp['data']);
        else setData([]);
        setSwitchingCampaignsFlag(false);
    };
    useEffect(() => {
        getSumarizedReports();
    }, [sellerId, dateRange]);

    useEffect(() => {
        filterData(filters, data);
    }, [data]);

    const [filteredData, setFilteredData] = useState<any[]>([] as any[]);

    const recalc = () => {};
    const [filteredSummary, setFilteredSummary] = useState({});
    const filterData = (withfFilters: any = {}, tableData: any = {}) => {
        const temp = [] as any;
        const filteredSummaryTemp: any = {};

        for (const [art, info] of Object.entries(
            Object.keys(tableData).length ? tableData : data,
        )) {
            const artInfo: any = info;
            if (!art || !artInfo || !artInfo?.['realizationreport_id']) continue;

            const tempTypeRow = artInfo;

            let addFlag = true;
            const useFilters = withfFilters['undef'] ? withfFilters : filters;
            for (const [filterArg, data] of Object.entries(useFilters)) {
                const filterData: any = data;
                if (filterArg == 'undef' || !filterData) continue;
                if (filterData['val'] == '') continue;

                if (!compare(tempTypeRow[filterArg], filterData)) {
                    addFlag = false;
                    break;
                }
            }

            if (addFlag) {
                temp.push(tempTypeRow);

                for (const [key, val] of Object.entries(tempTypeRow)) {
                    if (['realizationreport_id', 'create_dt', 'date_to', 'date_from'].includes(key))
                        continue;

                    if (!filteredSummaryTemp[key]) filteredSummaryTemp[key] = 0;

                    filteredSummaryTemp[key] += val ?? 0;
                }
            }
        }

        temp.sort((a: any, b: any) => {
            return b?.realizationreport_id - a?.realizationreport_id;
        });

        setFilteredSummary(filteredSummaryTemp);
        setFilteredData(temp);
    };

    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'end',
                    marginBottom: 8,
                }}
            >
                <RangePicker
                    args={{
                        recalc,
                        dateRange,
                        setDateRange,
                    }}
                />
            </div>

            <TheTable
                columnData={columnData}
                data={filteredData}
                filters={filters}
                setFilters={setFilters}
                filterData={filterData}
                footerData={[filteredSummary]}
                tableId={'detailedReportsSummaryPage'}
                usePagination={true}
                defaultPaginationSize={50}
            />
        </div>
    );
};
