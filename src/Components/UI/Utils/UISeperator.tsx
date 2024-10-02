import { View } from "react-native";
import { Colors } from "../../../styles/constants";

export const UISeperator = () => {
    return (
        <View
            style={{
                height: 2,
                backgroundColor: Colors.input,
            }}
        />
    );
};
