import {TextTitleWrapper} from '@/components/TextTitleWrapper';
import {ModalWindow} from '@/shared/ui/Modal';
import ApiClient from '@/utilities/ApiClient';
import {Button, Text, TextInput} from '@gravity-ui/uikit';
import {Children, cloneElement, isValidElement, ReactElement, useState} from 'react';

interface EditCommentI {
    children: ReactElement<any, any>;
    referal: string;
    setUpdateFlag: Function;
}

export const EditComment = ({children, referal, setUpdateFlag}: EditCommentI) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClick = async () => {
        handleClose();
        try {
            const response = await ApiClient.post('auth/update-comment-referal', {
                referal,
                comment,
            });
            setUpdateFlag(true);
            console.log(new Date(), 'update-comment-referal', response);
        } catch (error) {
            console.error(new Date(), error);
        }
    };

    const [comment, setComment] = useState<string>('');

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

    const triggerButton = cloneElement(triggerElement, {
        onClick: handleOpen,
    });

    return (
        <>
            {triggerButton}
            <ModalWindow isOpen={open} handleClose={handleClose}>
                <div style={{gap: 12, display: 'flex', flexDirection: 'column'}}>
                    <TextTitleWrapper padding={8} title="Комментарий">
                        <TextInput
                            size="l"
                            value={comment}
                            onUpdate={(val) => {
                                setComment(val);
                            }}
                        />
                    </TextTitleWrapper>
                    <Button pin="circle-circle" selected size="l" onClick={handleClick}>
                        Обновить комментарий
                    </Button>
                    <Text variant="caption-2" color="secondary">
                        Добавьте короткое описание данной ссылки чтобы проще различать ссылки между
                        собой.
                    </Text>
                </div>
            </ModalWindow>
        </>
    );
};
