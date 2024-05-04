import { View } from "react-native";
import React from "react";
import { Colors } from "../styles/constants";

const Header = () => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.bg,
                opacity: 0,
            }}
        />
    );
};

export default Header;
