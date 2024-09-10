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
                rowGap: Spacing.sm,
                paddingBottom: Spacing.sm,
            }}
        >
            {/* <View
            style={{
                justifyContent: "space-between",
                flexDirection: "row",
            }}
        >
            <Text style={[textStyles.h6, { opacity: 0.7 }]}>
                Playlist name
            </Text>
            <Text style={[textStyles.h6, { opacity: 0.7 }]}>
                {playlists.length} Playlists
            </Text>
        </View> */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    columnGap: Spacing.sm,
                }}
            >
                <TouchableNativeFeedback
                    onPress={() => {
                        addListToQueue(songs);
                    }}
                    disabled={songs.length === 0}
                >
                    <View
                        style={[
                            mainStyles.button_skeleton,
                            {
                                borderColor: Colors.primary30,
                                borderWidth: 1,
                                flex: 1,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                opacity: 0.7,
                                columnGap: Spacing.sm,
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="play"
                            size={IconSizes.md}
                            color={Colors.primary}
                            style={songs.length === 0 ? { opacity: 0.5 } : {}}
                        />
                        <Text
                            style={[
                                textStyles.text,
                                songs.length === 0 ? { opacity: 0.5 } : {},
                                { textAlign: "center" },
                            ]}
                            adjustsFontSizeToFit
                        >
                            Play
                        </Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                    onPress={() => {
                        shuffleList(songs);
                    }}
                    disabled={songs.length === 0}
                >
                    <View
                        style={[
                            mainStyles.button_skeleton,
                            {
                                borderColor: Colors.primary30,
                                borderWidth: 1,
                                flex: 1,
                                opacity: 0.7,
                                columnGap: Spacing.sm,
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="shuffle"
                            size={IconSizes.md}
                            color={Colors.primary}
                            style={songs.length === 0 ? { opacity: 0.5 } : {}}
                        />
                        <Text
                            style={[
                                textStyles.text,
                                songs.length === 0 ? { opacity: 0.5 } : {},
                                { textAlign: "center" },
                            ]}
                            adjustsFontSizeToFit
                        >
                            Shuffle
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    );
};
