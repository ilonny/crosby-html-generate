import React from "react";
import { Link } from "react-router-dom";
export const Header = () => {
    return (
        <div
            style={{
                margin: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Link to="/">
                <img
                alt=""
                    src={require("../../assets/images/logo.png")}
                    style={{ cursor: "pointer" }}
                />
            </Link>
        </div>
    );
};
