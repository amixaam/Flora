import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Colors } from "../styles/constants";

const Header = () => {
    return (
        <LinearGradient
            colors={[Colors.bg, "transparent"]}
            locations={[0, 1]}
            style={{ flex: 1 }}
        ></LinearGradient>
    );
};

export default Header;
