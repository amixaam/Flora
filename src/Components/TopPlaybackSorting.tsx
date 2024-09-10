import { Text, TouchableNativeFeedback, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSongsStore } from "../store/songs";
import { Colors, IconSizes, Spacing } from "../styles/constants";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { Song } from "../types/song";

interface TopButtonControlsProps {
    horizontalMargins?: number;
    songs: Song[];
}

export const TopButtonControls = ({
    horizontalMargins = Spacing.sm,
    songs,
}: TopButtonControlsProps) => {
    const { addListToQueue, shuffleList } = useSongsStore();

    return (
        <View
            style={{
                paddingTop: Spacing.sm,
                paddingHorizontal: horizontalMargins,
                paddingBottom: Spacing.sm,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    gap: Spacing.md,
                }}
            >
                <QuickButton
                    songs={songs}
                    onPress={addListToQueue}
                    text="Play"
                    icon="play"
                />
                <QuickButton
                    songs={songs}
                    onPress={shuffleList}
                    text="Shuffle"
                    icon="shuffle"
                />
            </View>
        </View>
    );
};

interface QuickButtonProps {
    songs: Song[];
    onPress: (songs: Song[]) => void;
    text?: string;
    icon?: string;
}

const QuickButton = ({
    songs,
    onPress,
    text = "text",
    icon = "alert-circle",
}: QuickButtonProps) => {
    return (
        <TouchableNativeFeedback
            onPress={() => {
                onPress(songs);
            }}
            disabled={songs.length === 0}
        >
            <View
                style={[
                    mainStyles.button_skeleton,
                    {
                        flex: 1,
                        gap: Spacing.sm,
                        borderColor: Colors.primary30,
                        borderWidth: 1,
                        backgroundColor: Colors.neon10,
                    },
                ]}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={IconSizes.md}
                    color={Colors.primary}
                    style={songs.length === 0 ? { opacity: 0.5 } : {}}
                />
                <Text
                    style={[
                        textStyles.text,
                        songs.length === 0 ? { opacity: 0.5 } : {},
                        { marginTop: Spacing.xs },
                    ]}
                >
                    {text}
                </Text>
            </View>
        </TouchableNativeFeedback>
    );
};
