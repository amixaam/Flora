import { Easing, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import TextTicker from "react-native-text-ticker";
import { usePlaybackState } from "react-native-track-player";
import SongListItem from "../../Components/UI/UI chunks/SongListItem";
import SheetHeader from "../../Components/UI/Headers/SheetHeader";
import SwipeDownScreen from "../../Components/UI/Utils/SwipeDownScreen";
import { useSongsStore } from "../../store/songs";
import { Colors, Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";
import { Song } from "../../types/song";
import { CombineStrings } from "../../utils/CombineStrings";
import ListItemsNotFound from "../../Components/UI/Text/ListItemsNotFound";
import AlbumArt from "../../Components/UI/UI chunks/AlbumArt";

const QueueScreen = () => {
    const { queue } = useSongsStore();

    return (
        <SwipeDownScreen>
            <SheetHeader title="Queue" />
            <NowPlayingItem />
            <ScrollView style={{ flex: 1 }}>
                {queue.length === 0 && (
                    <ListItemsNotFound
                        text={`Queue is empty`}
                        icon="music-note"
                    />
                )}
                {queue.map((song, index) => (
                    <SongListItem
                        key={`${song.id}-${index}`}
                        item={song as Song}
                        showImage
                    />
                ))}
            </ScrollView>
        </SwipeDownScreen>
    );
};

const NowPlayingItem = () => {
    const playback = usePlaybackState();
    const { play, pause, activeSong } = useSongsStore();

    const hanldePlayPausePress = () => {
        if (playback.state === "playing") pause();
        else play();
    };

    if (!activeSong) return null;

    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor: Colors.input,
                padding: Spacing.md,
                borderRadius: Spacing.radiusLg,
                marginHorizontal: Spacing.appPadding / 2,
                gap: Spacing.md,
                marginBottom: Spacing.sm,
            }}
        >
            <View style={{ flex: 1, flexDirection: "row", gap: Spacing.md }}>
                <AlbumArt image={activeSong.artwork} />
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 4,
                        flex: 1,
                    }}
                >
                    <TextTicker
                        key={activeSong.title}
                        style={textStyles.h6}
                        duration={12 * 1000}
                        marqueeDelay={2 * 1000}
                        easing={Easing.linear}
                        bounce={false}
                        scroll={false}
                        loop
                    >
                        {activeSong.title}
                    </TextTicker>
                    <Text
                        style={[
                            textStyles.small,
                            { marginBottom: -2, opacity: 0.75 },
                        ]}
                        numberOfLines={1}
                    >
                        {CombineStrings([activeSong.artist, activeSong.year])}
                    </Text>
                </View>
            </View>
            <IconButton
                icon={playback.state === "playing" ? "pause" : "play"}
                iconColor={Colors.primary}
                onPress={hanldePlayPausePress}
            />
        </View>
    );
};

export default QueueScreen;
