import {Button, Icon, TextInput, Tooltip} from '@gravity-ui/uikit';
import {ArrowRotateLeft} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import React, {useEffect, useMemo, useState} from 'react';
import callApi from 'src/utilities/callApi';
import {useError} from 'src/pages/ErrorContext';

export const PaginationSizeInput = ({
    paginationSize,
    setFetchPaginationSize,
    setPage,
    user,
    tableId,
}) => {
    const {showError} = useError();
    const [tempPaginationSize, setTempPaginationSize] = useState(paginationSize);
    useEffect(() => {
        setTempPaginationSize(paginationSize);
    }, [paginationSize]);

    const validTempPaginationSize = useMemo(() => {
        return (
            !isNaN(Number(tempPaginationSize)) &&
            tempPaginationSize != '' &&
            1 <= Number(tempPaginationSize) &&
            Number(tempPaginationSize) <= 1000
        );
    }, [tempPaginationSize]);

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Tooltip openDelay={1500} content={'Кол-во строк на странице.'}>
                <TextInput
                    placeholder={paginationSize}
                    rightContent={
                        tempPaginationSize != paginationSize ? (
                            <Button
                                size="xs"
                                view="flat-secondary"
                                onClick={() => setTempPaginationSize(paginationSize)}
                            >
                                <Icon data={ArrowRotateLeft} />
                            </Button>
                        ) : undefined
                    }
                    validationState={!validTempPaginationSize ? 'invalid' : undefined}
                    value={tempPaginationSize}
                    onUpdate={(val) => {
                        setTempPaginationSize(val);
                    }}
                    style={{
                        width: tempPaginationSize != paginationSize ? 69 : 50,
                        marginRight: 8,
                    }}
                />
            </Tooltip>
            <motion.div
                style={{width: 0, overflow: 'hidden'}}
                animate={{
                    width: validTempPaginationSize && tempPaginationSize != paginationSize ? 90 : 0,
                    marginRight:
                        validTempPaginationSize && tempPaginationSize != paginationSize ? 8 : 0,
                }}
            >
                <Button
                    selected
                    onClick={() => {
                        const params = {
                            user_id: user?._id,
                            table_id: tableId,
                            pagination_size: parseInt(tempPaginationSize),
                        };
                        callApi('updatePaginationSize', params, false, true)
                            .catch((error) => {
                                showError(
                                    error.response?.data?.error || 'An unknown error occurred',
                                );
                            })
                            .finally(() => {
                                setPage(1);
                                setFetchPaginationSize(true);
                            });
                    }}
                >
                    Сохранить
                </Button>
            </motion.div>
        </div>
    );
};
