import {Button, Icon, Modal, Select} from '@gravity-ui/uikit';
import React, {useEffect, useMemo, useState} from 'react';
import {FileArrowUp, ChevronDown, Key} from '@gravity-ui/icons';
import {motion} from 'framer-motion';
import {DzhemUpload} from './DzhemUpload';

export const UploadModal = ({
    selectOptions,
    selectValue,
    setDzhemRefetch,
}: {
    selectOptions: any[];
    selectValue: string[];
    setRefetchAutoSales: Function;
    setDzhemRefetch: Function;
}) => {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const [selectedCampaignForUpload, setSelectedCampaignForUpload] = useState(selectValue);
    useEffect(() => {
        setSelectedCampaignForUpload(selectValue);
    }, [selectValue]);

    const uploadOptions = useMemo(() => {
        return [
            {value: 'undefined', content: 'Выберите тип файла для загрузки'},
            {value: 'uploadDzhem', content: 'Джем'},
        ];
    }, []);
    const [uploadOption, setUploadOption] = useState([uploadOptions[0].value]);

    useEffect(() => {
        setCurrentStep(0);
        setUploadOption([uploadOptions[0].value]);
    }, [uploadModalOpen]);

    const uploadInputs = {
        uploadDzhem: (
            <DzhemUpload
                setUploadModalOpen={setUploadModalOpen}
                selectValue={selectedCampaignForUpload}
                setDzhemRefetch={setDzhemRefetch}
            />
        ),
    };

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button
                pin="clear-clear"
                view="flat"
                size="l"
                onClick={() => {
                    setUploadModalOpen(true);
                }}
            >
                <Icon data={FileArrowUp} />
            </Button>
            <Modal
                open={uploadModalOpen}
                onClose={() => {
                    setUploadModalOpen(false);
                }}
            >
                <motion.div
                    style={{
                        width: 300,
                        margin: 20,
                        flexWrap: 'nowrap',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'none',
                    }}
                >
                    <motion.div
                        animate={{height: currentStep < 3 ? 36 : 0}}
                        style={{height: 36, overflow: 'hidden', width: '100%'}}
                    >
                        <Select
                            size="l"
                            width="max"
                            options={uploadOptions}
                            value={uploadOption}
                            onUpdate={(opt) => {
                                setUploadOption(opt);
                                setCurrentStep(opt[0] == uploadOptions[0].value ? 0 : 1);
                            }}
                        />
                    </motion.div>
                    <motion.div
                        animate={{height: currentStep == 1 ? 48 : 0}}
                        style={{
                            overflow: 'hidden',
                            height: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'end',
                            width: '100%',
                        }}
                    >
                        <Select
                            size="l"
                            width="max"
                            options={selectOptions}
                            value={selectedCampaignForUpload}
                            onUpdate={(opt) => {
                                setSelectedCampaignForUpload(opt);
                            }}
                            renderControl={({onClick, onKeyDown, ref}) => {
                                return (
                                    <Button
                                        width="max"
                                        view="outlined"
                                        ref={ref}
                                        size="l"
                                        onClick={onClick}
                                        extraProps={{
                                            onKeyDown,
                                        }}
                                    >
                                        <Icon data={Key} />
                                        {selectedCampaignForUpload[0]}
                                        <Icon data={ChevronDown} />
                                    </Button>
                                );
                            }}
                        />
                    </motion.div>
                    <motion.div
                        animate={{maxHeight: currentStep > 0 ? 450 : 0}}
                        style={{
                            maxHeight: 0,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'end',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {uploadInputs[uploadOption[0]]}
                    </motion.div>
                </motion.div>
            </Modal>
        </div>
    );
};
