import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { textStyles } from "../../../styles/text";

interface TextHeaderProps {
    text?: string;
    style?: StyleProp<TextStyle>;
}

const TextHeader = ({ text = "Header", style }: TextHeaderProps) => {
    return <Text style={[textStyles.h4, style]}>{text}</Text>;
};

export default TextHeader;
