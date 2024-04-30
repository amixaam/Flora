import { View, Text } from "react-native";
import React from "react";
import { colors } from "../styles/constants";

const Header = () => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.bg,
                opacity: 0,
            }}
        />
    );
};

export default Header;
