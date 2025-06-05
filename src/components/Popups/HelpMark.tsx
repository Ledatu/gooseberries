import {CircleQuestion} from '@gravity-ui/icons';
import {Icon, PopupPlacement, Tooltip} from '@gravity-ui/uikit';

interface HelpMarkProps {
    content: React.ReactNode;
    placement?: PopupPlacement;
}

export const HelpMark = ({content}: HelpMarkProps) => {
    return (
        <Tooltip content={content}>
            <Icon data={CircleQuestion} />
        </Tooltip>
    );
};
