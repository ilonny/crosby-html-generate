import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { Layout, Menu, Breadcrumb } from "antd";
import download from "downloadjs";
import { Upload, Checkbox, Modal } from "antd";
import {
    LoadingOutlined,
    PlusOutlined,
    DeleteOutlined,
    CopyOutlined,
    EyeOutlined,
    CodepenOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { API_HOST } from "../AddItem/AddItem";
// const { SubMenu } = Menu;
// const { Header, Content, Sider } = Layout;
export const HomePage = () => {
    const [searchString, setSearchString] = useState("");
    const [items, setItems] = useState([]);
    const getData = () => {
        fetch(`${API_HOST}/site/get-all`)
            .then((res) => res.json())
            .then((res) => {
                setItems(res);
            });
    };
    const [htmlPreview, setHtmlPreview] = useState("");
    const [modalIsVisible, setModalIsVisible] = useState(false);

    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        if (!searchString) {
            getData();
        }
        setItems(
            items.filter((item) => {
                let data = JSON.parse(item.data);
                data = data[0];
                if (data.name.indexOf(searchString) !== -1) {
                    return true;
                }
            })
        );
    }, [searchString]);
    console.log("items all", items);
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
                <div>
                    {items.map((item) => {
                        let data = JSON.parse(item.data);
                        data = data[0];
                        let rawData = JSON.parse(item.data);
                        console.log("data", data);
                        return (
                            <div key={item.id}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        margin: "20px 0",
                                        padding: 20,
                                        boxShadow:
                                            "0 0 10px 1px rgba(0,0,0,0.2)",
                                        borderRadius: 10,
                                    }}
                                >
                                    <img
                                        src={`${API_HOST}/${data.image}`}
                                        style={{ maxWidth: 100 }}
                                        alt=""
                                    />
                                    <div
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            paddingLeft: 30,
                                        }}
                                    >
                                        <p>{data.name}</p>
                                        <p>{data.price}</p>
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                            display: "flex",
                                        }}
                                    >
                                        <button
                                            style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 50,
                                                border: "none",
                                                cursor: "pointer",
                                                background: "#FFECEB",
                                            }}
                                            onClick={() => {
                                                fetch(
                                                    `${API_HOST}/site/delete?id=${item.id}`
                                                )
                                                    .then((res) => res.json())
                                                    .then((res) => {
                                                        getData();
                                                    });
                                            }}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                        <button
                                            style={{
                                                width: 120,
                                                height: 50,
                                                borderRadius: 50,
                                                border: "none",
                                                cursor: "pointer",
                                                background: "#F7F7F7",
                                                marginLeft: 20,
                                            }}
                                            onClick={() => {
                                                setModalIsVisible(true);
                                                fetch(
                                                    `${API_HOST}/site/get-html`,
                                                    {
                                                        method: "POST",
                                                        cors: true,
                                                        body: JSON.stringify({
                                                            data: rawData,
                                                        }),
                                                        // headers: {
                                                        //     "Content-Type": "application/json",
                                                        // },
                                                    }
                                                )
                                                    .then((res) => res.json())
                                                    .then((res) => {
                                                        console.log(
                                                            "html res",
                                                            res
                                                        );
                                                        setHtmlPreview(
                                                            res.html
                                                        );
                                                        const sc = new Function(
                                                            res.script
                                                        );
                                                        sc();
                                                    });
                                            }}
                                        >
                                            <EyeOutlined />
                                            <span style={{ paddingLeft: 10 }}>
                                                PREVIEW
                                            </span>
                                        </button>
                                        <button
                                            style={{
                                                width: 120,
                                                height: 50,
                                                borderRadius: 50,
                                                border: "none",
                                                cursor: "pointer",
                                                background: "#F7F7F7",
                                                marginLeft: 20,
                                            }}
                                            onClick={() => {
                                                fetch(
                                                    `${API_HOST}/site/get-html?download=1`,
                                                    {
                                                        method: "POST",
                                                        cors: true,
                                                        body: JSON.stringify({
                                                            data: rawData,
                                                        }),
                                                    }
                                                )
                                                    .then((res) => res.blob())
                                                    .then((res) => {
                                                        download(res, data.name);
                                                        // console.log("html res", res);
                                                    });
                                            }}
                                        >
                                            <CodepenOutlined />
                                            <span style={{ paddingLeft: 10 }}>
                                                GET CODE
                                            </span>
                                        </button>
                                        <Link to={"/add-item/" + item.id}>
                                            <button
                                                style={{
                                                    width: 120,
                                                    height: 50,
                                                    borderRadius: 50,
                                                    border: "none",
                                                    cursor: "pointer",
                                                    background: "#F7F7F7",
                                                    marginLeft: 20,
                                                }}
                                            >
                                                <span
                                                    style={{ paddingLeft: 0 }}
                                                >
                                                    EDIT
                                                </span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        );
                    })}
                </div>
            </div>
            <Modal
                title="Preview"
                visible={modalIsVisible}
                onCancel={() => {
                    setHtmlPreview("");
                    setModalIsVisible(false);
                }}
                onOk={() => {
                    setHtmlPreview("");
                    setModalIsVisible(false);
                }}
            >
                <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
            </Modal>
        </>
    );
};
