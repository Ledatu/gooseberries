import React from 'react';
import block from 'bem-cn-lite';
import {
    ThemeProvider,
    Button,
    Text,
    Container,
    Row,
    Col,
    TextInput,
    Persona,
} from '@gravity-ui/uikit';
import '../../App.scss';
import Userfront from '@userfront/toolkit';

const b = block('app');

enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export const HomePage = () => {
    // const [theme, setTheme] = React.useState(Theme.Light);
    // const [dialogOpen, setDialogOpen] = React.useState(false);

    return (
        <ThemeProvider theme={Theme.Light}>
            <div className={b()}>
                {/* <TextInput style={{width: '300px'}} placeholder="Ola, Ledatu!" /> */}
                <Container style={{width: '100%', backgroundColor: '#fff', borderRadius: '8px'}}>
                    <Row space={10} style={{alignItems: 'center'}}>
                        <Col s="7">
                            <Text variant="header-1">Управление магазинами</Text>
                        </Col>
                        <Col s="3">
                            <Persona text={Userfront.user.email ?? ''}></Persona>
                        </Col>
                        <Col s="2">
                            <Button
                                className={b('button')}
                                // size="m"
                                view="outlined"
                                // href="https://preview.gravity-ui.com/uikit/"
                                target="_blank"
                                onClick={() => {
                                    Userfront.logout();
                                }}
                            >
                                {/* <Icon data={iconStorybook} /> */}
                                Logout
                            </Button>
                        </Col>
                    </Row>
                    {/* <Row space={10}></Row> */}
                    <Row space={10} style={{marginTop: '20px'}}>
                        <Col s="4">
                            <Text variant="subheader-1">Название</Text>
                            <Container style={{height: '10px'}}></Container>
                            <TextInput placeholder="Название" />
                            <Container style={{height: '10px'}}></Container>
                            <Button
                                className={b('button')}
                                // size="l"
                                style={{marginLeft: '0px'}}
                                // view=
                                // href="https://preview.gravity-ui.com/uikit/"
                                target="_blank"
                                // onClick={() => {
                                //     // Userfront.logout();
                                // }}
                            >
                                {/* <Icon data={iconStorybook} /> */}
                                Добавить
                            </Button>
                        </Col>
                        <Col s="4">
                            <Text variant="subheader-1">Ключ Апи</Text>
                            <Container style={{height: '10px'}}></Container>
                            <TextInput placeholder="Ключ Апи" />
                        </Col>
                        <Col s="4">
                            <Text style={{marginRight: '400px'}} variant="subheader-1">
                                Обновить
                            </Text>
                            <Container style={{height: '10px'}}></Container>
                            <Button
                                className={b('button')}
                                size="m"
                                view="outlined"
                                // href="https://preview.gravity-ui.com/uikit/"
                                target="_blank"
                                // onClick={() => {
                                //     // Userfront.logout();
                                // }}
                            >
                                {/* <Icon data={iconStorybook} /> */}
                                Обновить
                            </Button>
                        </Col>
                    </Row>
                </Container>
                {/* <img src={logo} className={b('logo')} alt="logo" /> */}
                {/* <div className={b('buttons-block')}>
                    <Button
                        className={b('button')}
                        size="l"
                        view="outlined"
                        disabled={theme === Theme.Light}
                        onClick={() => {
                            setTheme(Theme.Light);
                        }}
                    >
                        Light theme
                    </Button>
                    <Button
                        className={b('button')}
                        size="l"
                        view="outlined"
                        disabled={theme === Theme.Dark}
                        onClick={() => {
                            setTheme(Theme.Dark);
                        }}
                    >
                        Dark theme
                    </Button>
                </div> */}
                <div className={b('content')}>
                    {/* <div className={b('content-item')}> */}

                    {/* </div> */}
                    {/* <div className={b('content-item')}>
                        <Label className={b('label')} theme="normal">
                            normal
                        </Label>
                        <Label className={b('label')} theme="info">
                            info
                        </Label>
                        <Label className={b('label')} theme="success">
                            success
                        </Label>
                        <Label className={b('label')} theme="warning">
                            warning
                        </Label>
                        <Label className={b('label')} theme="danger">
                            danger
                        </Label>
                        <Label className={b('label')} theme="unknown">
                            unknown
                        </Label>
                    </div> */}
                    {/* <div className={b('content-item')}>
                        <Button
                            onClick={() => {
                                setDialogOpen(true);
                            }}
                            view="normal"
                        >
                            Show dialog
                        </Button>
                        <Dialog
                            open={dialogOpen}
                            onClose={() => {
                                setDialogOpen(false);
                            }}
                            onEnterKeyDown={() => {
                                setDialogOpen(false);
                            }}
                        >
                            <Dialog.Header caption="Title" />
                            <Dialog.Body>Content</Dialog.Body>
                            <Dialog.Footer
                                onClickButtonApply={() => {
                                    setDialogOpen(false);
                                }}
                                onClickButtonCancel={() => {
                                    setDialogOpen(false);
                                }}
                                textButtonApply="Apply"
                                textButtonCancel="Cancel"
                            />
                        </Dialog>
                    </div> */}
                </div>
            </div>
        </ThemeProvider>
    );
};
