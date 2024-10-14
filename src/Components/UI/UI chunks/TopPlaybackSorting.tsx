import { Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { useSongsStore } from "../../../store/songs";
import { Colors, Spacing } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import { Song } from "../../../types/song";
import Pluralize from "../../../utils/Pluralize";

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
