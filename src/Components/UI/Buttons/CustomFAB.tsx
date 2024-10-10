import { FAB } from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import { Colors, Spacing } from "../../../styles/constants";

const CustomFAB = ({ onPress }: { onPress: () => void }) => {
    const track = useActiveTrack();

    const extraSpacing = track ? Spacing.miniPlayer : 0;

    return (
        <FAB
            icon="plus"
            style={{
                position: "absolute",
                bottom: Spacing.md + extraSpacing,
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
