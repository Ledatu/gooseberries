import { getEnumurationString } from "@/utilities/getEnumerationString";
import { TriangleExclamation } from "@gravity-ui/icons";
import { Icon, Text, Tooltip } from "@gravity-ui/uikit";

interface warningArtIconProps {
    words: string[];
}

export const WarningArtIcon = ({words}: warningArtIconProps) => {
    return (
        <div>
            <Tooltip
                style={{maxWidth: '400px'}}
                content={
                    <Text>
                        Внимание: расчёт прибыли выполнен с ошибкой. Пожалуйста, укажите&nbsp;
                        {getEnumurationString(words)} для корректного отображения данных
                    </Text>
                }
            >
                <Text style={{color: 'rgb(255, 190, 92)'}}>
                    <Icon data={TriangleExclamation} size={11} />
                </Text>
            </Tooltip>
        </div>
    );
};
