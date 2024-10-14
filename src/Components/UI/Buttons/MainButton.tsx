import {
    Pressable,
    PressableProps,
    StyleProp,
    Text,
    TextStyle,
    ViewStyle,
} from "react-native";
import { Colors, Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { TouchableRipple, TouchableRippleProps } from "react-native-paper";

interface MainButtonProps extends PressableProps {
    children?: React.ReactNode;
    text?: string;
    type?: "primary" | "secondary" | "round";
    fitWidth?: boolean;
    flex?: boolean;
}

const MainButton = ({
    children,
    text,
    type = "primary",
    flex = false,
    ...pressableProps
}: MainButtonProps) => {
    let style: StyleProp<ViewStyle> = [
        mainStyles.button_skeleton,
        { backgroundColor: Colors.primary },
    ];
    let textStyle: StyleProp<TextStyle> = [
        textStyles.text,
        { color: Colors.bg },
    ];

    switch (type) {
        case "primary":
            break;
        case "secondary":
            style = [...style, { backgroundColor: Colors.input }];
            textStyle = [...textStyle, { color: Colors.primary }];
            break;
        case "round":
            style = [...style, { borderRadius: Spacing.round }];
            break;
    }

    return (
        <TouchableRipple
            style={[style, { flex: flex ? 1 : 0 }]}
            {...(pressableProps as TouchableRippleProps)}
        >
            {children ? children : <Text style={textStyle}>{text}</Text>}
        </TouchableRipple>
    );
};

export default MainButton;
