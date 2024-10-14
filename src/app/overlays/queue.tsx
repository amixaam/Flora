import React from "react";
import { Text, View } from "react-native";
import DraggableFlatList, {
    DragEndParams,
    RenderItemParams,
} from "react-native-draggable-flatlist";
import { IconButton } from "react-native-paper";
import TextTicker from "react-native-text-ticker";
import { usePlaybackState } from "react-native-track-player";
import SheetHeader from "../../Components/UI/Headers/SheetHeader";
import ListItemsNotFound from "../../Components/UI/Text/ListItemsNotFound";
import AlbumArt from "../../Components/UI/UI chunks/AlbumArt";
import SongItem from "../../Components/UI/UI chunks/SongItem";
import SwipeDownScreen from "../../Components/UI/Utils/SwipeDownScreen";
import { useSongsStore } from "../../store/songs";
import { Colors, Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";
import { Song } from "../../types/song";
import { CombineStrings } from "../../utils/CombineStrings";

const QueueScreen = () => {
    const { queue, setQueue } = useSongsStore();

    const updateQueue = (item: DragEndParams<Song>) => {
        setQueue(item.data);
    };

    const renderItem = ({ item, drag, isActive }: RenderItemParams<Song>) => (
        <SongItem
            song={item}
            isActive={isActive}
            controls={
                <IconButton
                    icon={"drag"}
                    iconColor={Colors.primary}
                    onLongPress={drag}
                    delayLongPress={100}
                />
            }
        />
    );

    return (
        <SwipeDownScreen disable>
            <SheetHeader title="Queue" />
            <NowPlayingItem />
            {queue.length === 0 ? (
                <ListItemsNotFound text="Queue is empty" icon="music-note" />
            ) : (
                <DraggableFlatList
                    data={queue as Song[]}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    onDragEnd={updateQueue}
                />
            )}
        </SwipeDownScreen>
    );
};

const NowPlayingItem = () => {
    const playback = usePlaybackState();
    const { play, pause, activeSong } = useSongsStore();

    const handlePlayPausePress = () => {
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
                        easing={(t) => t}
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
                onPress={handlePlayPausePress}
            />
        </View>
    );
};

export default QueueScreen;
