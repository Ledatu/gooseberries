import {CircleRuble, Eye, LayoutHeaderCursor, LayoutHeaderSideContent} from '@gravity-ui/icons';

export const rules = [
    {content: 'СTR, %', value: 'ctr'},
    {content: 'CPC, ₽', value: 'cpc'},
    {content: 'CR в корзину, %', value: 'openToCartCurrent'},
    {content: 'CR в заказ, %', value: 'cartToOrderCurrent'},
    {content: 'CR, %', value: 'openToOrderPercent'},
    {content: 'ДРР, %', value: 'drr'},
    {content: 'CPO, ₽', value: 'cpo'},
];

export const getNameOfRule = (value: string) => {
    const name = rules.filter((rule) => rule.value == value);
    if (name.length) return name[0].content;
    return '';
};

export const thresholdKeyOptions = [
    {content: 'Показы', value: 'views'},
    {content: 'Расход', value: 'sum'},
    {content: 'Клики', value: 'clicks'},
    {content: 'Переходы', value: 'openCardCurrent'},
];

export const getIconOfThresholdKey = (value: string) => {
    if (value == 'views') return Eye;
    if (value == 'sum') return CircleRuble;
    if (value == 'clicks') return LayoutHeaderCursor;
    if (value == 'openCardCurrent') return LayoutHeaderSideContent;
    return Eye;
};
