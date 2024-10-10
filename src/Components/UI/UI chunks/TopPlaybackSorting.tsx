import { Text, TouchableNativeFeedback, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSongsStore } from "../../../store/songs";
import { Colors, IconSizes, Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Song } from "../../../types/song";
import Pluralize from "../../../utils/Pluralize";
import { IconButton } from "react-native-paper";

interface TopButtonControlsProps {
    horizontalMargins?: number;
    songs: Song[];
    type: string;
    count: number;
}

export const TopButtonControls = ({
    horizontalMargins = Spacing.sm,
    songs,
    type,
    count,
}: TopButtonControlsProps) => {
    const { shuffleList } = useSongsStore();

    return (
        <View
            style={{
                paddingHorizontal: horizontalMargins,
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Text style={textStyles.text}>
                {Pluralize(count, type, `${type}s`)}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    gap: Spacing.md,
                }}
            >
                <IconButton
                    style={{
                        marginRight: -Spacing.sm,
                    }}
                    icon={"shuffle"}
                    onPress={() => shuffleList(songs)}
                    iconColor={Colors.primary}
                />
            </View>
        </View>
    );
};
