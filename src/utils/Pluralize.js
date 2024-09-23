import { View, Text } from "react-native";
import React from "react";

export default function Pluralize(count, noun, plural, showCount = true) {
    const text = showCount ? count + " " : "";
    if (count === 1) {
        return text + noun;
    } else {
        return text + plural;
    }
}
