import React, { useState, useEffect } from "react";
// import { Layout, Menu, Breadcrumb } from "antd";
import { useParams } from "react-router-dom";
import { Upload, Checkbox, Modal } from "antd";
import download from "downloadjs";
// let download = require('./download.min');
import {
    LoadingOutlined,
    PlusOutlined,
    DeleteOutlined,
    CopyOutlined,
    EyeOutlined,
    CodepenOutlined,
    ArrowLeftOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
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

export const AddItem = (props) => {
    const initialItem = {
        image: "",
        name: "",
        price: "",
        descrip: "",
        buttons: "",
    };
    const [items, setItems] = useState([{ ...initialItem }]);
    const [imageLoading, setImageLoading] = useState(false);
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [htmlPreview, setHtmlPreview] = useState("");
    const uploadButton = (
        <div>
            {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        setItems([{ ...initialItem }]);
    }, []);
    const { id } = useParams();
    console.log("id", id);
    useEffect(() => {
        fetch(`${API_HOST}/site/data?id=${id}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    setItems(JSON.parse(res.data));
                }
            });
    }, [id]);
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
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <button
                        style={{
                            width: 120,
                            height: 50,
                            borderRadius: 50,
                            border: "none",
                            cursor: "pointer",
                            background: "#FFECEB",
                            marginBottom: 20,
                        }}
                        onClick={() => {
                            props.history.push("/");
                        }}
                    >
                        <ArrowLeftOutlined />
                        <span style={{ paddingLeft: 10 }}>Go back</span>
                    </button>
                    {/* <p>{'&lt;br/&gt;>'} - отступ в тексте</p> */}
                    <p>{"<br />"} - отступ в тексте</p>
                </div>
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
                                marginBottom: 20,
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
                                <div style={{ marginLeft: 0 }}>
                                    <h2>AR file</h2>
                                    <Upload
                                        name={`ar_link`}
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action={`${API_HOST}/site/upload`}
                                        style={{ width: "auto" }}
                                        onChange={(info) => {
                                            if (
                                                info.file.status === "uploading"
                                            ) {
                                                setImageLoading(true);
                                                return;
                                            }
                                            if (info.file.status === "done") {
                                                setImageLoading(false);
                                                console.log("res", info);
                                                changeItem(
                                                    index,
                                                    "ar_link",
                                                    info.file.name
                                                );
                                            }
                                        }}
                                    >
                                        {item.ar_link ? (
                                            <button>{item.ar_link}</button>
                                        ) : (
                                            <button>upload AR file</button>
                                        )}
                                    </Upload>
                                    {item.ar_link && (
                                        <button
                                            onClick={() => {
                                                changeItem(
                                                    index,
                                                    "ar_link",
                                                    null
                                                );
                                            }}
                                        >
                                            delete AR file
                                        </button>
                                    )}
                                </div>
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
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                >
                                    <h2>About product</h2>
                                    <div>
                                        <button
                                            style={{
                                                width: 40,
                                                height: 40,
                                                marginRight: 15,
                                            }}
                                            onClick={() => {
                                                if (items[index - 1]) {
                                                    let it = [...items];
                                                    let temp = item;
                                                    it[index] =
                                                        items[index - 1];
                                                    it[index - 1] = temp;
                                                    setItems(it);
                                                }
                                            }}
                                        >
                                            <ArrowUpOutlined />
                                        </button>
                                        <button
                                            style={{
                                                width: 40,
                                                height: 40,
                                                marginRight: 15,
                                            }}
                                            onClick={() => {
                                                if (items[index + 1]) {
                                                    let it = [...items];
                                                    let temp = item;
                                                    it[index] =
                                                        items[index + 1];
                                                    it[index + 1] = temp;
                                                    setItems(it);
                                                }
                                            }}
                                        >
                                            <ArrowDownOutlined />
                                        </button>
                                    </div>
                                </div>
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
                                                value={item.preorder_link}
                                                placeholder="Preorder link"
                                                onChange={(e) => {
                                                    changeItem(
                                                        index,
                                                        "preorder_link",
                                                        e.target.value
                                                    );
                                                }}
                                                style={{
                                                    background: "#F7F7F7",
                                                    flex: 1,
                                                    height: 40,
                                                    width: "100%",
                                                    padding: 10,
                                                    marginLeft: 20,
                                                }}
                                            />
                                            {/* <input
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
                                            /> */}

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
                                                onClick={() => {
                                                    setItems(
                                                        items.filter(
                                                            (item, index_f) =>
                                                                index_f != index
                                                        )
                                                    );
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
                                                onClick={() => {
                                                    setItems(
                                                        items.concat({
                                                            ...items[index],
                                                        })
                                                    );
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
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <button
                        onClick={() => {
                            setItems(items.concat({ ...initialItem }));
                        }}
                        style={{
                            width: 323,
                            height: 64,
                            border: "2px dashed #031EE8",
                            borderRadius: 100,
                            cursor: "pointer",
                            background: "#fff",
                        }}
                    >
                        ADD OPTION
                    </button>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
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
                                if (id) {
                                    fetch(`${API_HOST}/site/delete?id=${id}`)
                                        .then((res) => res.json())
                                        .then((res) => {
                                            props.history.push("/");
                                        });
                                } else {
                                    props.history.push("/");
                                }
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
                                fetch(`${API_HOST}/site/get-html`, {
                                    method: "POST",
                                    cors: true,
                                    body: JSON.stringify({
                                        data: items,
                                    }),
                                    // headers: {
                                    //     "Content-Type": "application/json",
                                    // },
                                })
                                    .then((res) => res.json())
                                    .then((res) => {
                                        console.log("html res", res);
                                        setHtmlPreview(res.html);
                                        const sc = new Function(res.script);
                                        sc();
                                        // eval(res.script);
                                        // if (res.id) {
                                        //     console.log("redirect");
                                        //     alert("successful saved");
                                        //     props.history.push(
                                        //         "/add-item/" + res.id
                                        //     );
                                        // }
                                    });
                            }}
                        >
                            <EyeOutlined />
                            <span style={{ paddingLeft: 10 }}>PREVIEW</span>
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
                                fetch(`${API_HOST}/site/get-html?download=1`, {
                                    method: "POST",
                                    cors: true,
                                    body: JSON.stringify({
                                        data: items,
                                    }),
                                })
                                    .then((res) => res.blob())
                                    .then((res) => {
                                        download(res, items[0].name);
                                        // console.log("html res", res);
                                    });
                            }}
                        >
                            <CodepenOutlined />
                            <span style={{ paddingLeft: 10 }}>GET CODE</span>
                        </button>
                        <button
                            style={{
                                width: 120,
                                height: 50,
                                borderRadius: 50,
                                border: "none",
                                cursor: "pointer",
                                background: "#031ee8",
                                marginLeft: 20,
                            }}
                            onClick={() => {
                                fetch(`${API_HOST}/site/save`, {
                                    method: "POST",
                                    cors: true,
                                    body: JSON.stringify({
                                        data: items,
                                        id: id ? id : 0,
                                    }),
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                })
                                    .then((res) => res.json())
                                    .then((res) => {
                                        if (res.id) {
                                            console.log("redirect");
                                            alert("successful saved");
                                            props.history.push(
                                                "/add-item/" + res.id
                                            );
                                        }
                                    });
                            }}
                        >
                            <span style={{ paddingLeft: 0, color: "#fff" }}>
                                SAVE
                            </span>
                        </button>
                    </div>
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
