import { CircleQuestion } from "@gravity-ui/icons"
import { Icon, Popover } from "@gravity-ui/uikit"


export const HelpMark = ({content, placement}: any) => {
return <Popover style={{padding: '8px'}} content={content}
		placement={placement}>
		<Icon data={CircleQuestion}/>
		</Popover>
}