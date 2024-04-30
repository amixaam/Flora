import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import { useSongsStore } from "../store/songs";
import AlbumArt from "./AlbumArt";
import IconButton from "./UI/IconButton";

import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import {
    useActiveTrack,
    usePlaybackState,
    useProgress,
} from "react-native-track-player";
import PlaybackSlider from "./PlaybackSlider";

export const MiniPlayer = ({ style }) => {
    const {
        play,
        pause,
        next,
        previous,
        addSongLike,
        removeSongLike,

        currentTrack,
        getSong,
        seekToPosition,
    } = useSongsStore();
    const activeTrack = useActiveTrack();
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const handleLikeButtonPress = () => {
        if (songData.isLiked) {
            removeSongLike(songData.id);
            songData.isLiked = false;
        } else {
            addSongLike(songData.id);
            songData.isLiked = true;
        }
    };

    const hanldePlayPausePress = () => {
        if (playbackState.state === "playing") pause();
        else play();
    };

    const [songData, setSongData] = useState(getSong(currentTrack));
    useEffect(() => {
        setSongData(getSong(currentTrack));
    }, [currentTrack]);

    if (!activeTrack) return;
    return (
        <TouchableNativeFeedback
            onPress={() => router.push("/player")}
            style={[style, mainStyles.color_bg]}
        >
            <View style={mainStyles.miniPlayer}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: 8,
                    }}
                >
                    <AlbumArt
                        image={activeTrack.artwork}
                        style={{
                            height: 48,
                            aspectRatio: 1,
                            borderRadius: 5,
                        }}
                    />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            columnGap: 16,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                width: "100%",
                            }}
                        >
                            <Text style={textStyles.h6} numberOfLines={1}>
                                {activeTrack.title}
                            </Text>
                            <Text style={textStyles.detail} numberOfLines={1}>
                                {activeTrack.artist
                                    ? activeTrack.artist
                                    : "No artist"}
                                {" • "}
                                {activeTrack.date
                                    ? new Date(activeTrack.date).getFullYear()
                                    : "No date"}
                            </Text>
                        </View>
                        {/* <View style={{ marginTop: -10, marginLeft: -13 }}>
                            <IconButton
                                onPress={handleLikeButtonPress}
                                icon={
                                    songData.isLiked ? "heart" : "heart-outline"
                                }
                                size={18}
                            />
                        </View> */}
                        <View style={{ flexDirection: "row", columnGap: 16 }}>
                            <IconButton
                                onPress={previous}
                                icon="skip-previous"
                                size={36}
                            />
                            <IconButton
                                onPress={hanldePlayPausePress}
                                icon={
                                    playbackState.state === "playing"
                                        ? "pause"
                                        : "play"
                                }
                                size={36}
                            />
                            <IconButton
                                onPress={next}
                                icon="skip-next"
                                size={36}
                            />
                        </View>
                    </View>
                </View>
                <PlaybackSlider
                    trackDuration={progress.duration}
                    trackPosition={progress.position}
                    skipPosition={seekToPosition}
                />
            </View>
        </TouchableNativeFeedback>
    );
};
export default MiniPlayer;
