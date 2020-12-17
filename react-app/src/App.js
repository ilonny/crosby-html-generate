import React from "react";
import { connect } from "react-redux";
// import { mainRedcuer } from "./lib/store";
import { hot } from "react-hot-loader";
import { Normalize } from "styled-normalize";

import { Routes } from "./routes";
import { GlobalStyles } from "./global-styles";
import "antd/dist/antd.css";
import { Layout } from "antd";

// import { Link } from "react-router-dom";
// import { API_HOST } from "./lib";
import { Header } from "./features/header";

// const { SubMenu } = Menu;
const { Content } = Layout;

const _MainComp = () => {
    // console.log("props", props);
    return (
        <>
            <Normalize />
            <GlobalStyles />
            <Layout style={{ flex: 1, background: "#fff" }}>
                <Layout style={{ background: "#fff" }}>
                    <Header />
                </Layout>
                <Layout style={{ background: "#fff" }}>
                    <Content style={{ padding: 30 }}>
                        <Routes />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

const MainComp = connect(
    (state) => ({
        // user: state.main.user,
    }),
    (dispatch) => ({})
)(_MainComp);

export const App = hot(module)(() => (
    <>
        <MainComp />
    </>
));
