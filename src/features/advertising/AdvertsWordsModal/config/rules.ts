export const rules = [
    {content: 'СTR, %', value: 'ctr'},
    {content: 'CPC, ₽', value: 'cpc'},
    {content: 'CR в корзину, %', value: 'openToCartCurrent'},
    {content: 'CR в заказ, %', value: 'cartToOrderCurrent'},
    {content: 'CR, %', value: 'openToOrderPercent'},
];

export const getNameOfRule = (value: string) => {
    const name = rules.filter((rule) => rule.value == value);
    if (name.length) return name[0].content;
    return '';
};
