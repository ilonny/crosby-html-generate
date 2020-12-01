import React, { useState, useEffect } from "react";
// import { Layout, Menu, Breadcrumb } from "antd";

import { Upload, Checkbox } from "antd";
import {
    LoadingOutlined,
    PlusOutlined,
    DeleteOutlined,
    CopyOutlined,
} from "@ant-design/icons";

// const { SubMenu } = Menu;
// const { Header, Content, Sider } = Layout;

export const API_HOST =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : "";

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
}

export const AddItem = () => {
    const initialItem = {
        image: "",
        name: "",
        price: "",
        descrip: "",
        buttons: "",
    };
    const [items, setItems] = useState([{ ...initialItem }]);
    const [imageLoading, setImageLoading] = useState(false);

    const uploadButton = (
        <div>
            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        setItems([{ ...initialItem }]);
    }, []);
    const changeItem = (index, key, value) => {
        let oldItems = [...items];
        let item = oldItems[index];
        item[key] = value;
        console.log("changeItem", oldItems);
        setItems([...oldItems]);
    };
    console.log("items", items);
    return (
        <>
            <div style={{ maxWidth: 1159, margin: "auto" }}>
                {items.map((item, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                padding: 20,
                                boxShadow: "0 0 10px 1px rgba(0,0,0,0.2)",
                                borderRadius: 10,
                            }}
                        >
                            <div
                                style={{
                                    width: 230,
                                }}
                            >
                                <h2>Photo</h2>
                                <Upload
                                    name={`image`}
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action={`${API_HOST}/site/upload`}
                                    onChange={(info) => {
                                        if (info.file.status === "uploading") {
                                            setImageLoading(true);
                                            return;
                                        }
                                        if (info.file.status === "done") {
                                            console.log("image uploaded", info);
                                            setImageLoading(false);
                                            changeItem(
                                                index,
                                                "image",
                                                info.file.response
                                            );
                                        }
                                    }}
                                >
                                    {item.image ? (
                                        <img
                                            src={`${API_HOST}/${item.image}`}
                                            alt="avatar"
                                            style={{ width: "100%" }}
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </div>
                            <div
                                style={{
                                    // width: 820,
                                    flex: 1,
                                    // padding: 20,
                                    // boxShadow: "0 0 10px 1px rgba(0,0,0,0.2)",
                                    // borderRadius: 10,
                                }}
                            >
                                <h2>About product</h2>
                                <div style={{ marginTop: 0 }}>
                                    <div style={{ display: "flex" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginBottom: 20,
                                                flex: 1,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 90,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "flex-start",
                                                }}
                                            >
                                                <h3>NAME:</h3>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    style={{
                                                        background: "#F7F7F7",
                                                        flex: 1,
                                                        height: 55,
                                                        width: "100%",
                                                        padding: 10,
                                                    }}
                                                    onChange={(e) => {
                                                        changeItem(
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        );
                                                    }}
                                                    value={item.name}
                                                />
                                            </div>
                                        </div>
                                        {/* <!-- --> */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginBottom: 20,
                                                flex: 1,
                                                marginLeft: 20,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 90,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "flex-start",
                                                }}
                                            >
                                                <h3>PRICE:</h3>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    style={{
                                                        background: "#F7F7F7",
                                                        flex: 1,
                                                        height: 55,
                                                        width: "100%",
                                                        padding: 10,
                                                    }}
                                                    onChange={(e) => {
                                                        changeItem(
                                                            index,
                                                            "price",
                                                            e.target.value
                                                        );
                                                    }}
                                                    value={item.price}
                                                />
                                            </div>
                                        </div>
                                        {/* <!-- --> */}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: 20,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 90,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            <h3>DESCRIP:</h3>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <textarea
                                                style={{
                                                    background: "#F7F7F7",
                                                    flex: 1,
                                                    height: 55,
                                                    width: "100%",
                                                    padding: 10,
                                                }}
                                                onChange={(e) => {
                                                    changeItem(
                                                        index,
                                                        "descrip",
                                                        e.target.value
                                                    );
                                                }}
                                                value={item.descrip}
                                            />
                                        </div>
                                    </div>
                                    {/* <!-- --> */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                            }}
                                        >
                                            <input
                                                placeholder="Buy link"
                                                style={{
                                                    background: "#F7F7F7",
                                                    flex: 1,
                                                    height: 40,
                                                    width: "100%",
                                                    padding: 10,
                                                }}
                                                onChange={(e) => {
                                                    changeItem(
                                                        index,
                                                        "buy_link",
                                                        e.target.value
                                                    );
                                                }}
                                                value={item.buy_link}
                                            />
                                            <input
                                                placeholder="Preorder link"
                                                style={{
                                                    background: "#F7F7F7",
                                                    flex: 1,
                                                    height: 40,
                                                    width: "100%",
                                                    padding: 10,
                                                    marginLeft: 20,
                                                }}
                                            />
                                            <input
                                                placeholder="AR link"
                                                style={{
                                                    background: "#F7F7F7",
                                                    flex: 1,
                                                    height: 40,
                                                    width: "100%",
                                                    padding: 10,
                                                    marginLeft: 20,
                                                }}
                                                onChange={(e) => {
                                                    changeItem(
                                                        index,
                                                        "ar_link",
                                                        e.target.value
                                                    );
                                                }}
                                                value={item.ar_link}
                                            />
                                            <Checkbox
                                                // checked={this.state.checked}
                                                // disabled={this.state.disabled}
                                                // onChange={this.onChange}
                                                style={{ marginLeft: 20 }}
                                                checked={item.coming}
                                                onChange={(e) => {
                                                    changeItem(
                                                        index,
                                                        "coming",
                                                        e.target.checked
                                                    );
                                                }}
                                            >
                                                COMING SOON
                                            </Checkbox>
                                        </div>
                                        <div>
                                            <button
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 50,
                                                    border: "none",
                                                    cursor: "pointer",
                                                    background: "#FFECEB",
                                                }}
                                            >
                                                <DeleteOutlined />
                                            </button>
                                            <button
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 50,
                                                    border: "none",
                                                    cursor: "pointer",
                                                    background: "#F2F4FF",
                                                    marginLeft: 20,
                                                }}
                                            >
                                                <CopyOutlined />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
