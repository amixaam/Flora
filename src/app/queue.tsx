import { Easing, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import TextTicker from "react-native-text-ticker";
import { useActiveTrack, usePlaybackState } from "react-native-track-player";
import AlbumArt from "../Components/AlbumArt";
import SongListItem from "../Components/SongListItem";
import SheetHeader from "../Components/UI/Headers/SheetHeader";
import ListItemsNotFound from "../Components/UI/ListItemsNotFound";
import SwipeDownScreen from "../Components/UI/Utils/SwipeDownScreen";
import { useSongsStore } from "../store/songs";
import { Colors, Spacing } from "../styles/constants";
import { textStyles } from "../styles/text";
import { CombineStrings } from "../utils/CombineStrings";
import { Song } from "../types/song";
import { ScrollView } from "react-native-gesture-handler";

const QueueScreen = () => {
    const { queue } = useSongsStore();

    return (
        <SwipeDownScreen>
            <SheetHeader title="Queue" />
            <NowPlayingItem />
            <ScrollView style={{ flex: 1 }}>
                {/* <FlashList
                    data={queue}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    estimatedItemSize={50}
                    ListEmptyComponent={
                        <ListItemsNotFound
                            text={`Queue is empty`}
                            icon="music-note"
                        />
                    }
                    renderItem={({ item }) => {
                        return (
                            <SongListItem
                                key={item.id}
                                item={item as Song}
                                showImage
                            />
                        );
                    }}
                /> */}
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
    const activeTrack = useActiveTrack();
    const { play, pause } = useSongsStore();

    if (activeTrack === undefined) return null;

    const hanldePlayPausePress = () => {
        if (playback.state === "playing") pause();
        else play();
    };

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
                <AlbumArt image={activeTrack.artwork} />
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 4,
                        flex: 1,
                    }}
                >
                    <TextTicker
                        key={activeTrack.title}
                        style={textStyles.h6}
                        duration={12 * 1000}
                        marqueeDelay={2 * 1000}
                        easing={Easing.linear}
                        bounce={false}
                        scroll={false}
                        loop
                    >
                        {activeTrack.title}
                    </TextTicker>
                    <Text
                        style={[
                            textStyles.small,
                            { marginBottom: -2, opacity: 0.75 },
                        ]}
                        numberOfLines={1}
                    >
                        {CombineStrings([activeTrack.artist, activeTrack.year])}
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
