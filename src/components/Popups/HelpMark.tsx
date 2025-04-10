import {CircleQuestion} from '@gravity-ui/icons';
import {Icon, Popover, PopupPlacement} from '@gravity-ui/uikit';

interface HelpMarkProps {
    content: React.ReactNode;
    placement?: PopupPlacement;
}

export const HelpMark = ({content, placement}: HelpMarkProps) => {
    return (
        <Popover content={content} placement={placement} offset={-4} enableSafePolygon={true}>
            <Icon data={CircleQuestion} />
        </Popover>
    );
};
