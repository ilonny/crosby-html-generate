import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { Layout, Menu, Breadcrumb } from "antd";
import {
    // UserOutlined,
    // LaptopOutlined,
    // NotificationOutlined,
    SearchOutlined,
} from "@ant-design/icons";

// const { SubMenu } = Menu;
// const { Header, Content, Sider } = Layout;
export const HomePage = () => {
    const [searchString, setSearchString] = useState("");
    useEffect(() => {}, []);
    return (
        <>
            <div style={{ maxWidth: 1159, margin: "auto" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <div style={{ flex: 1, position: "relative" }}>
                        <SearchOutlined
                            style={{ position: "absolute", left: 9, top: 14 }}
                        />
                        <input
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                            style={{
                                background: "#F7F7F7",
                                flex: 1,
                                height: 40,
                                paddingLeft: 40,
                                width: "100%",
                                borderRadius: 40,
                            }}
                            placeholder="SEARCH"
                        />
                    </div>
                    {/* <Link to={{ pathname: "restaurant", state: { id } }}> */}
                    <Link to={{ pathname: "add-item" }}>
                        <button
                            style={{
                                width: 190,
                                height: 40,
                                background: "#031EE8",
                                borderRadius: 40,
                                border: "none",
                                color: "#fff",
                                marginLeft: 20,
                                cursor: "pointer",
                            }}
                        >
                            + NEW PRODUCT
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};
