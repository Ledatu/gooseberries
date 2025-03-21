import {Card, Text, Link, Button, Icon} from '@gravity-ui/uikit';
import {ManageUserModal} from './ManageUserModal';
import {Pencil} from '@gravity-ui/icons';

export const UserInfo = ({user, view}: {user: any; view: any}) => {
    const {first_name: firstName, last_name: lastName, username, photo_url: photoUrl} = user ?? {};
    return (
        <Card
            view={view}
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 100,
            }}
        >
            <img src={photoUrl} style={{height: 36, borderRadius: 100, marginRight: 4}} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginRight: view == 'outlined' ? 18 : 0,
                }}
            >
                <Text variant="subheader-1">{`${firstName ?? ''} ${lastName ?? ''}`}</Text>
                <Link target="_blank" href={`https://t.me/${username}`} view="secondary">
                    @{username}
                </Link>
            </div>
        </Card>
    );
};

export const EditMemberInfo = ({user, sellerId, setUpdate}: any) => {
    return (
        <Card
            style={{
                height: 36,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
            }}
        >
            <UserInfo user={user?.member_id} view="clear" />
            <ManageUserModal
                modules={user?.modules ?? []}
                memberInfo={user?.member_id}
                sellerId={sellerId}
                setUpdate={setUpdate}
            >
                <Button view="flat" style={{margin: '0 4px'}} pin="circle-circle">
                    <Icon data={Pencil} />
                </Button>
            </ManageUserModal>
        </Card>
    );
};
