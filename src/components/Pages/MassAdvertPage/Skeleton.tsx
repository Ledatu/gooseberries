import {Card, Skeleton} from '@gravity-ui/uikit';
import {CSSProperties} from 'react';

const cardStyle: CSSProperties = {
    minWidth: '10em',
    height: '10em',
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: 'var(--g-color-base-background) 0px 2px 8px',
    marginRight: '8px',
    marginLeft: '8px',
};

export const MassAdvertPageSkeleton = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-around',
                    margin: '8px 0',
                }}
            >
                <Card style={{...cardStyle, flexDirection: 'column'}}>
                    <Skeleton style={{width: '50%', height: 18}} />
                    <div style={{minHeight: 4}} />
                    <Skeleton style={{width: '70%', height: 36}} />
                </Card>
                <Card style={{...cardStyle, flexDirection: 'column'}}>
                    <Skeleton style={{width: '50%', height: 18}} />
                    <div style={{minHeight: 4}} />
                    <Skeleton style={{width: '70%', height: 36}} />
                </Card>
                <Card style={{...cardStyle, flexDirection: 'column'}}>
                    <Skeleton style={{width: '50%', height: 18}} />
                    <div style={{minHeight: 4}} />
                    <Skeleton style={{width: '70%', height: 36}} />
                </Card>
                <Card style={{...cardStyle, flexDirection: 'column'}}>
                    <Skeleton style={{width: '50%', height: 18}} />
                    <div style={{minHeight: 4}} />
                    <Skeleton style={{width: '70%', height: 36}} />
                </Card>
                <Card style={{...cardStyle, flexDirection: 'column'}}>
                    <Skeleton style={{width: '50%', height: 18}} />
                    <div style={{minHeight: 4}} />
                    <Skeleton style={{width: '70%', height: 36}} />
                </Card>
                <Card style={{...cardStyle, flexDirection: 'column'}}>
                    <Skeleton style={{width: '50%', height: 18}} />
                    <div style={{minHeight: 4}} />
                    <Skeleton style={{width: '70%', height: 36}} />
                </Card>
                <Card style={{...cardStyle, flexDirection: 'column'}}>
                    <Skeleton style={{width: '50%', height: 18}} />
                    <div style={{minHeight: 4}} />
                    <Skeleton style={{width: '70%', height: 36}} />
                </Card>
                <Card style={{...cardStyle, flexDirection: 'column'}}>
                    <Skeleton style={{width: '50%', height: 18}} />
                    <div style={{minHeight: 4}} />
                    <Skeleton style={{width: '70%', height: 36}} />
                </Card>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Skeleton
                        style={{
                            width: 120,
                            height: 36,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: 120,
                            height: 36,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: 120,
                            height: 36,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: 120,
                            height: 36,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: 120,
                            height: 36,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: 120,
                            height: 36,
                        }}
                    />
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Skeleton
                        style={{
                            width: 120,
                            height: 36,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: 120,
                            height: 36,
                        }}
                    />
                    <div style={{minWidth: 4}} />
                    <Skeleton
                        style={{
                            width: 120,
                            height: 36,
                        }}
                    />
                </div>
            </div>
            <div style={{minHeight: 8}} />
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <Skeleton
                    style={{
                        width: '20vw',
                        height: 48,
                    }}
                />
                <div style={{minWidth: 4}} />
                <Skeleton
                    style={{
                        width: '100%',
                        height: 48,
                    }}
                />
            </div>
            <div style={{minHeight: 4}} />
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <Skeleton
                    style={{
                        width: '20vw',
                        height: 'calc(68vh - 96px)',
                    }}
                />
                <div style={{minWidth: 4}} />
                <Skeleton
                    style={{
                        width: '100%',
                        height: 'calc(68vh - 96px)',
                    }}
                />
            </div>
            <div style={{minHeight: 4}} />
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <Skeleton
                    style={{
                        width: '20vw',
                        height: 48,
                    }}
                />
                <div style={{minWidth: 4}} />
                <Skeleton
                    style={{
                        width: '100%',
                        height: 48,
                    }}
                />
            </div>
        </div>
    );
};
