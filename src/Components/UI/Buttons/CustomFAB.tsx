import { FAB } from "react-native-paper";
import { Colors, Spacing } from "../../../styles/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveTrack } from "react-native-track-player";

const CustomFAB = ({ onPress }: { onPress: () => void }) => {
    const { bottom } = useSafeAreaInsets();
    const track = useActiveTrack();

    const extraSpacing = track ? Spacing.miniPlayer : 0;

    return (
        <FAB
            icon="plus"
            style={{
                position: "absolute",
                bottom: bottom + extraSpacing,
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
