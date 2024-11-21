import React, {useEffect, useState} from 'react';
import {RangePicker} from 'src/components/RangePicker';
import TheTable from 'src/components/TheTable';
import callApi from 'src/utilities/callApi';
import {renderAsDate} from 'src/utilities/getRoundValue';

export const DetailedReportsPage = ({sellerId}) => {
    const columnData = [
        {name: 'realizationreport_id', placeholder: 'Номер отчёта', valueType: 'text'},
        {name: 'date_from', placeholder: 'Дата начала отчётного периода', render: renderAsDate},
        {name: 'date_to', placeholder: 'Дата конца отчётного периода', render: renderAsDate},
        {name: 'create_dt', placeholder: 'Дата формирования отчёта', render: renderAsDate},
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
        {name: 'primeCost', placeholder: 'Себестоимость'},
        {name: 'tax', placeholder: 'Налог'},
        {name: 'expenses', placeholder: 'Доп. расходы'},
        {name: 'quantity', placeholder: 'Количество'},
        {name: 'retail_price', placeholder: 'Цена розничная'},
        {name: 'retail_amount', placeholder: 'Сумма продаж (возвратов)'},
        {name: 'sale_percent', placeholder: 'Согласованная скидка'},
        {name: 'commission_percent', placeholder: 'Процент комиссии'},
        // {name: 'office_name', placeholder: 'Склад'},
        // {name: 'supplier_oper_name', placeholder: 'Обоснование для оплаты'},
        // {name: 'order_dt', placeholder: 'Дата заказа'},
        // {name: 'sale_dt', placeholder: 'Дата продажи'},
        // {name: 'rr_dt', placeholder: 'Дата операции'},
        // {name: 'shk_id', placeholder: 'Штрих-код'},
        {
            name: 'retail_price_withdisc_rub',
            placeholder: 'Цена розничная с учетом согласованной скидки',
        },
        {name: 'delivery_amount', placeholder: 'Количество доставок'},
        {name: 'return_amount', placeholder: 'Количество возвратов'},
        {name: 'delivery_rub', placeholder: 'Стоимость логистики'},
        // {name: 'gi_box_type_name', placeholder: 'Тип коробов'},
        {name: 'product_discount_for_report', placeholder: 'Согласованный продуктовый дисконт'},
        // {name: 'supplier_promo', placeholder: 'Промокод'},
        // {name: 'rid', placeholder: 'Уникальный идентификатор заказа'},
        {name: 'ppvz_spp_prc', placeholder: 'Скидка постоянного покупателя'},
        {name: 'ppvz_kvw_prc_base', placeholder: 'Размер кВВ без НДС, % базовый'},
        {name: 'ppvz_kvw_prc', placeholder: 'Итоговый кВВ без НДС, %'},
        {name: 'sup_rating_prc_up', placeholder: 'Размер снижения кВВ из-за рейтинга'},
        {name: 'is_kgvp_v2', placeholder: 'Размер снижения кВВ из-за акции'},
        {
            name: 'ppvz_sales_commission',
            placeholder: 'Вознаграждение с продаж до вычета услуг поверенного, без НДС',
        },
        {name: 'ppvz_for_pay', placeholder: 'К перечислению продавцу за реализованный товар'},
        {name: 'ppvz_reward', placeholder: 'Возмещение за выдачу и возврат товаров на ПВЗ'},
        {name: 'acquiring_fee', placeholder: 'Возмещение издержек по эквайрингу'},
        {name: 'acquiring_percent', placeholder: 'Размер комиссии за эквайринг без НДС, %'},
        // {name: 'acquiring_bank', placeholder: 'Наименование банка-эквайера'},
        {name: 'ppvz_vw', placeholder: 'Вознаграждение WB без НДС'},
        {name: 'ppvz_vw_nds', placeholder: 'НДС с вознаграждения WB'},
        // {name: 'ppvz_office_id', placeholder: 'Номер офиса'},
        // {name: 'ppvz_office_name', placeholder: 'Наименование офиса доставки'},
        // {name: 'ppvz_supplier_id', placeholder: 'Номер партнера'},
        // {name: 'ppvz_supplier_name', placeholder: 'Партнер'},
        // {name: 'ppvz_inn', placeholder: 'ИНН партнера'},
        // {name: 'declaration_number', placeholder: 'Номер таможенной декларации'},
        // {name: 'bonus_type_name', placeholder: 'Обоснование штрафов и доплат'},
        // {name: 'sticker_id', placeholder: 'Цифровое значение стикера'},
        // {name: 'site_country', placeholder: 'Страна продажи'},
        {name: 'penalty', placeholder: 'Штрафы'},
        {name: 'additional_payment', placeholder: 'Доплаты'},
        {name: 'rebill_logistic_cost', placeholder: 'Возмещение издержек по перевозке'},
        // {name: 'rebill_logistic_org', placeholder: 'Организатор перевозки'},
        // {name: 'kiz', placeholder: 'Код маркировки'},
        {name: 'storage_fee', placeholder: 'Стоимость хранения'},
        {name: 'deduction', placeholder: 'Прочие удержания/выплаты'},
        {name: 'acceptance', placeholder: 'Стоимость платной приёмки'},
        // {name: 'srid', placeholder: 'Уникальный идентификатор заказа'},
        // {name: 'report_type', placeholder: 'Тип отчёта'},
    ] as any[];
    const [filters, setFilters] = useState({undef: false});
    const [data, setData] = useState([] as any[]);

    const getArtsTags = async () => {
        if (sellerId == '') setData([]);
        const params = {seller_id: sellerId};
        const artsTagsTemp = await callApi('getSumarizedReports', params).catch((e) => {
            console.log(e);
        });
        console.log('getArtsTags', params, artsTagsTemp);
        if (artsTagsTemp && artsTagsTemp['data']) setData(artsTagsTemp['data']);
        else setData([]);
    };
    useEffect(() => {
        getArtsTags();
    }, [sellerId]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const [filteredData, setFilteredData] = useState([] as any[]);

    const yesterday = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 30);
    const [dateRange, setDateRange] = useState([weekAgo, yesterday]);

    const recalc = () => {};
    const filterData = () => {};

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
                tableId={'detailedReportsSummaryPage'}
                usePagination={true}
                defaultPaginationSize={50}
            />
        </div>
    );
};
