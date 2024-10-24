import React, { memo, useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import DraggableFlatList, {
    DragEndParams,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { IconButton } from "react-native-paper";
import TextTicker from "react-native-text-ticker";
import { usePlaybackState } from "react-native-track-player";
import ListItemsNotFound from "../../Components/UI/Text/ListItemsNotFound";
import AlbumArt from "../../Components/UI/UI chunks/AlbumArt";
import SongItem from "../../Components/UI/UI chunks/SongItem";
import SwipeDownScreen from "../../Components/UI/Utils/SwipeDownScreen";
import { useSongsStore } from "../../store/songsStore";
import { Colors, Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";
import { Song } from "../../types/song";
import { CombineStrings } from "../../utils/CombineStrings";
import SheetHeader from "../../Components/UI/Headers/SheetHeader";

const QueueScreen = () => {
    const { queue, setQueue } = useSongsStore();

    // Optimistic update handler
    const updateQueue = useCallback(
        async ({ data: newQueue }: DragEndParams<Song>) => {
            useSongsStore.setState({ queue: newQueue });

            try {
                await setQueue(newQueue);
            } catch (error) {
                console.error("Failed to update queue:", error);
                useSongsStore.setState({ queue });
            }
        },
        [queue, setQueue]
    );

    const renderItem = useCallback(
        (params: RenderItemParams<Song>) => <QueueItem {...params} />,
        []
    );

    const keyExtractor = useCallback((item: Song) => item.id, []);

    const memoizedQueue = useMemo(() => queue as Song[], [queue]);

    return (
        <SwipeDownScreen disable header={<SheetHeader title="Queue" />}>
            <NowPlayingItem />
            {queue.length === 0 ? (
                <ListItemsNotFound text="Queue is empty" icon="music-note" />
            ) : (
                <DraggableFlatList
                    data={memoizedQueue}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onDragEnd={updateQueue}
                    containerStyle={{ flex: 1 }}
                    dragHitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    activationDistance={5}
                />
            )}
        </SwipeDownScreen>
    );
};

const NowPlayingItem = memo(() => {
    const playback = usePlaybackState();
    const { play, pause, activeSong } = useSongsStore();

    const handlePlayPausePress = useCallback(() => {
        if (playback.state === "playing") pause();
        else play();
    }, [playback.state, pause, play]);

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
});

const QueueItem = React.memo(
    ({ item, drag, isActive }: RenderItemParams<Song>) => {
        return (
            <ScaleDecorator activeScale={1.05}>
                <SongItem
                    song={item}
                    isActive={isActive}
                    controls={
                        <IconButton
                            icon="drag"
                            iconColor={Colors.primary}
                            onLongPress={drag}
                            delayLongPress={50}
                        />
                    }
                />
            </ScaleDecorator>
        );
    }
);

export default QueueScreen;
