import {CircleQuestion} from '@gravity-ui/icons';
import {Icon, PopupPlacement, Tooltip} from '@gravity-ui/uikit';

interface HelpMarkProps {
    content: React.ReactNode;
    placement?: PopupPlacement;
    iconSize?: number;
}

export const HelpMark = ({content, iconSize}: HelpMarkProps) => {
    return (
        <Tooltip content={content}>
            <Icon data={CircleQuestion} size={iconSize} />
        </Tooltip>
    );
};
