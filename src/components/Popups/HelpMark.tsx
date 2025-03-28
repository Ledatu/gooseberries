import {CircleQuestion} from '@gravity-ui/icons';
import {ActionTooltip, Icon} from '@gravity-ui/uikit';

export const HelpMark = ({content, placement}: any) => {
    return (
        <ActionTooltip style={{padding: '8px'}} title={content} placement={placement}>
            <Icon data={CircleQuestion} />
        </ActionTooltip>
    );
};
