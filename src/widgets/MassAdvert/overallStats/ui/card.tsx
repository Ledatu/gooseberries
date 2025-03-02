import {Card, Text} from '@gravity-ui/uikit';
import {CSSProperties, FC} from 'react';

interface StatisticsCardProps {
    value: string | number;
    placeholder: string;
    cardStyle: CSSProperties;
    valueType?: 'text';
    percent?: boolean;
    rub?: boolean;
}

export const StatisticsCard: FC<StatisticsCardProps> = ({
    rub,
    cardStyle,
    valueType,
    percent,
    placeholder,
    value,
}) => {
    return (
        <Card style={cardStyle} view="outlined">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Text
                    style={{whiteSpace: 'pre-wrap', textAlign: 'center'}}
                >{`${placeholder}`}</Text>
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: '18pt',
                        marginBottom: 10,
                        marginTop: 4,
                    }}
                >
                    {/*{10 ** Math.floor(Math.random() * 15)}*/}
                    {valueType == 'text'
                        ? value
                        : new Intl.NumberFormat('ru-RU').format(value as any)}
                    {percent ? '%' : ''}
                    {rub ? ' ₽' : ''}
                </Text>
            </div>
        </Card>
    );
};
