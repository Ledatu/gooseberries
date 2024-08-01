import {Button, Icon, List, Modal, Text} from '@gravity-ui/uikit';
import {Tag} from '@gravity-ui/icons';
import React, {useEffect, useState} from 'react';
import callApi, {getUid} from 'src/utilities/callApi';

export const TagsFilterModal = ({filterByButton, selectValue}) => {
    const [tagsModalOpen, setTagsModalOpen] = useState(false);
    const [availableTagsPending, setAvailableTagsPending] = useState(false);
    const [availableTags, setAvailableTags] = useState([] as any[]);

    useEffect(() => {
        setAvailableTagsPending(true);
        callApi('getAllTags', {
            uid: getUid(),
            campaignName: selectValue[0],
        })
            .then((res) => {
                if (!res) throw 'no response';
                const {tags} = res['data'] ?? {};
                tags.sort();
                setAvailableTags(tags ?? []);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setAvailableTagsPending(false);
            });
    }, [selectValue]);

    return (
        <div>
            <Button
                style={{cursor: 'pointer', marginRight: '8px', marginBottom: '8px'}}
                view="action"
                size="l"
                loading={availableTagsPending}
                onClick={async () => {
                    setTagsModalOpen(true);
                }}
            >
                <Icon data={Tag} />
                <Text variant="subheader-1">Теги</Text>
            </Button>
            <Modal
                open={tagsModalOpen}
                onClose={() => {
                    setTagsModalOpen(false);
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        width: '30vw',
                        height: '60vh',
                        margin: 20,
                    }}
                >
                    {availableTagsPending ? (
                        <div></div>
                    ) : (
                        <List
                            filterPlaceholder="Введите имя тега"
                            emptyPlaceholder="Такой тег отсутствует"
                            loading={availableTagsPending}
                            items={availableTags}
                            renderItem={(item) => {
                                return (
                                    <Button
                                        size="xs"
                                        pin="circle-circle"
                                        selected
                                        view={'outlined-info'}
                                    >
                                        {item.toUpperCase()}
                                    </Button>
                                );
                            }}
                            onItemClick={(item) => {
                                filterByButton(item);
                                setTagsModalOpen(false);
                            }}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};
