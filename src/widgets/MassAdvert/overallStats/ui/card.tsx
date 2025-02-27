import {Card, Text} from '@gravity-ui/uikit';

export const StatisticsCard = (args: any) => {
    const {summary, key, placeholder, cardStyle, valueType, percent, rub} = args;
    return (
        <Card style={cardStyle} view="outlined">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Text style={{whiteSpace: 'pre-wrap'}}>{`${placeholder}`}</Text>
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: '18pt',
                        marginBottom: 10,
                        marginTop: 4,
                    }}
                >
                    {valueType == 'text'
                        ? summary[key]
                        : new Intl.NumberFormat('ru-RU').format(summary[key])}
                    {percent ? '%' : ''}
                    {rub ? ' ₽' : ''}
                </Text>
            </div>
        </Card>
    );
};
