import {Button, Card, Modal, TextInput, Text, Switch} from '@gravity-ui/uikit';
import {motion} from 'framer-motion';
import React, {Children, isValidElement, ReactElement, useMemo, useState} from 'react';

interface AddMemberModalInterface {
    children: ReactElement | ReactElement[];
}

export const AddMemberModal = ({children}: AddMemberModalInterface) => {
    const [open, setOpen] = useState(false);

    const [username, setUsername] = useState('');
    const [modulesEnabled, setModulesEnabled] = useState({
        massAdvert: false,
        analytics: false,
        delivery: false,
        prices: false,
        nomenclatures: false,
        buyers: false,
        seo: false,
    });

    const modules = useMemo(() => {
        const modulesTemp = [] as string[];
        for (const [key, enabled] of Object.entries(modulesEnabled)) {
            if (!enabled) continue;
            modulesTemp.push(key);
        }
        return modulesTemp;
    }, [modulesEnabled]);

    const modulesSwitches = useMemo(() => {
        const modulesSwitchesTemp = [] as any[];
        for (const [key, enabled] of Object.entries(modulesEnabled)) {
            if (!enabled) continue;
            modulesSwitchesTemp.push(
                <Switch
                    checked={enabled}
                    content={key}
                    onUpdate={(val) =>
                        setModulesEnabled((cur) => {
                            cur[key] = val;
                            return {...cur};
                        })
                    }
                />,
            );
            modulesSwitchesTemp.push(<div style={{minHeight: 8}} />);
        }
        return modulesSwitchesTemp;
    }, [modulesEnabled]);

    const handleOpen = async () => {
        setOpen(true);
        setUsername('');
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Ensure children is an array, even if only one child is passed
    const childArray = Children.toArray(children);

    // Find the first valid React element to use as the trigger
    const triggerElement = childArray.find((child) => isValidElement(child)) as ReactElement<
        any,
        any
    >;

    if (!triggerElement) {
        console.error('AddApiModal: No valid React element found in children.');
        return null;
    }

    const triggerButton = React.cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
            <Modal open={open} onClose={handleClose}>
                <Card>
                    <motion.div
                        animate={{height: open ? 126 : 0}}
                        style={{
                            height: 0,
                            width: 300,
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            justifyContent: 'space-between',
                        }}
                    >
                        <TextInput
                            value={username}
                            onUpdate={(val) => setUsername(val)}
                            size="l"
                            placeholder="Введите <@Имя пользователя>"
                        />
                        {modulesSwitches}
                        <Button
                            size="l"
                            view="outlined-success"
                            selected
                            disabled={!modules.length || username === ''}
                            onClick={() => {
                                console.log(username, modules);
                            }}
                        >
                            <Text variant="subheader-1">Добавить сотрудника</Text>
                        </Button>
                    </motion.div>
                </Card>
            </Modal>
        </>
    );
};
