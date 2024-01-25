import React, {useEffect, useState} from 'react';
import {Button, Spin, Table, TableDataItem, TextInput, withTableSelection} from '@gravity-ui/uikit';
import {DocumentData, doc, getDoc, updateDoc} from 'firebase/firestore';
import Userfront from '@userfront/toolkit';
import {db} from 'src/utilities/firebase-config';

const MyTable = withTableSelection(Table);

const columns = [
    {id: 'Магазин', width: '50%', meta: {copy: ({id}) => `ID #${id}`}},
    {id: 'Ключ Апи', width: '50%', meta: {copy: true}},
];

const getUserDoc = () => {
    const [document, setDocument] = useState<DocumentData>();

    useEffect(() => {
        const dataFetch = async () => {
            // waiting for allthethings in parallel
            const result = (
                await getDoc(doc(db, 'customers', Userfront.user.userUuid ?? ''))
            ).data();

            // when the data is ready, save it to state
            setDocument(result);
        };

        dataFetch();
    }, []);

    return document;
};
import block from 'bem-cn-lite';
import {
    autoFetchAdvertInfos,
    autoFetchAdvertStats,
    autoFetchAdverts,
} from 'src/utilities/fetchRkData';
import axios from 'axios';
const b = block('app');

export const ApiPage = () => {
    const [selectedIds, setSelectedIds] = React.useState<Array<string>>([]);
    // const [document, setUserDoc] = React.useState(getUserDoc());
    const [enteredCampaign, setEnteredCampaign] = React.useState('');
    const [enteredApiKey, setEnteredApiKey] = React.useState('');
    const document = getUserDoc();

    if (!document) return <Spin />;
    const data: TableDataItem[] = [];
    const campaigns: any[] = [];
    for (let i = 0; i < document.campaigns.length; i++) {
        data.push({
            Магазин: document.campaigns[i]['campaignName'],
            'Ключ Апи':
                document.campaigns[i]['api-key'].length > 30
                    ? document.campaigns[i]['api-key'].slice(0, 30) + '...'
                    : document.campaigns[i]['api-key'],
        });
        campaigns.push({
            campaignName: document.campaigns[i]['campaignName'],
            'api-key': document.campaigns[i]['api-key'],
        });
    }
    // console.log(data);

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', width: '30wh'}}>
                <TextInput
                    placeholder={enteredApiKey != '' ? enteredApiKey : 'Магазин'}
                    onChange={(val) => setEnteredCampaign(val.target.value)}
                ></TextInput>

                <TextInput
                    placeholder={enteredApiKey != '' ? enteredApiKey : 'Ключ Апи'}
                    onChange={(val) => setEnteredApiKey(val.target.value)}
                ></TextInput>

                <Button
                    className={b('button')}
                    onClick={async () => {
                        try {
                            if (enteredCampaign != '' && enteredApiKey != '') {
                                campaigns.push({
                                    campaignName: enteredCampaign,
                                    'api-key': enteredApiKey,
                                });
                                data.push({
                                    Магазин: enteredCampaign,
                                    'Ключ Апи': enteredApiKey,
                                });
                                await updateDoc(
                                    doc(db, 'customers', Userfront.user.userUuid ?? ''),
                                    {campaigns},
                                );
                                // setEnteredCampaign('');

                                const token =
                                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc5ODcyMTM2fQ.p07pPkoR2uDYWN0d_JT8uQ6cOv6tO07xIsS-BaM9bWs';
                                axios
                                    .post(
                                        'https://185.164.172.100:24458/api/craftNecessaryFoldersAndFilesIfNeeded',
                                        {uid: Userfront.user.userUuid ?? '', campaigns: campaigns},
                                        {
                                            headers: {
                                                Authorization: 'Bearer ' + token,
                                            },
                                        },
                                    )
                                    .then(() => {
                                        window.location.reload();
                                    })
                                    .catch((error) => console.error(error));

                                // setEnteredApiKey('');
                                // document = getUserDoc();
                            }
                            // setUserDoc(getUserDoc());
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                >
                    Добавить
                </Button>
            </div>
            <MyTable
                className={b('tableApi')}
                data={data}
                columns={columns}
                onSelectionChange={(val) => {
                    console.log(val, selectedIds);
                    setSelectedIds(val);
                }}
                selectedIds={selectedIds}
            />
            <Button
                onClick={() => {
                    autoFetchAdverts();
                }}
            >
                UPDATE ADVERTS
            </Button>
            <Button
                onClick={() => {
                    autoFetchAdvertInfos();
                }}
            >
                UPDATE ADVERTINFOS
            </Button>
            <Button
                onClick={() => {
                    autoFetchAdvertStats();
                }}
            >
                UPDATE ADVERTSTATS
            </Button>
        </div>
    );
};
