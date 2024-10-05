import { FAB } from "react-native-paper";
import { Colors, Spacing } from "../../../styles/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomFAB = ({ onPress }: { onPress: () => void }) => {
    const { bottom } = useSafeAreaInsets();

    return (
        <FAB
            icon="plus"
            style={{
                position: "absolute",
                bottom: bottom + Spacing.miniPlayer,
                right: Spacing.appPadding,
                backgroundColor: Colors.primary,
                zIndex: 5,
            }}
            color={Colors.bg}
            onPress={onPress}
        />
    );
};

export default CustomFAB;
