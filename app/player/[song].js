import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useSongsStore } from "../../store/songs";
import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import Slider from "@react-native-community/slider";

function PlaybackControls({
    isPlaying,
    play,
    pause,
    next,
    previous,
    skipPosition,
    trackPosition,
    trackDuration,
    shuffle,
    playlist,
}) {
    const hanldePlayPausePress = () => {
        if (isPlaying) pause();
        else play();
    };

    const handleSkipNextPress = () => {
        next();
    };

    const handleSkipPreviousPress = () => {
        previous();
    };

    const handleShufflePress = () => {
        shuffle();
    };

    const formatMilliseconds = (milliseconds) => {
        const minutes = Math.floor(milliseconds / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    if (!trackDuration || !trackPosition) {
        trackDuration = 1;
        trackPosition = 0;
    }
    return (
        <View
            style={{
                flexDirection: "column",
                justifyContent: "center",
                rowGap: 8,
            }}
        >
            <Text style={{ textAlign: "center" }}>{playlist.name}</Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity onPress={handleShufflePress}>
                    <MaterialIcons name="shuffle" size={32} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSkipPreviousPress}>
                    <MaterialIcons name="skip-previous" size={48} />
                </TouchableOpacity>
                <TouchableOpacity onPress={hanldePlayPausePress}>
                    <MaterialIcons
                        name={isPlaying ? "pause-circle" : "play-circle"}
                        size={64}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSkipNextPress}>
                    <MaterialIcons name="skip-next" size={48} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShufflePress}>
                    <MaterialIcons
                        name="repeat"
                        size={32}
                        color={"lightgray"}
                    />
                </TouchableOpacity>
            </View>
            <Slider
                minimumValue={0}
                maximumValue={1}
                value={trackPosition / trackDuration}
                onSlidingComplete={async (value) => {
                    await skipPosition(value);
                }}
                thumbTintColor="black"
                minimumTrackTintColor="black"
            />
            <Text style={{ textAlign: "center", fontSize: 12 }}>
                {formatMilliseconds(trackPosition)} /{" "}
                {formatMilliseconds(trackDuration)}
            </Text>
        </View>
    );
}

export default function PlayerTab() {
    const { song } = useLocalSearchParams();
    const {
        getSong,
        selectedPlaylist,
        loadTrack,
        play,
        pause,
        isPlaying,
        next,
        previous,
        currentTrack,
        skipPosition,
        trackPosition,
        trackDuration,
        shuffle,
        playlist,
        addSongLike,
        removeSongLike,
    } = useSongsStore();

    const songData = getSong(song);

    useEffect(() => {
        if (songData !== currentTrack) {
            loadTrack(songData, selectedPlaylist);
        }
    }, []);

    const handleLikeButtonPress = () => {
        if (currentTrack) {
            if (currentTrack.isLiked) removeSongLike(currentTrack.id);
            else addSongLike(currentTrack.id);
        }
    };

    if (!currentTrack) return;
    return (
        <View
            style={{
                padding: 16,
                paddingTop: 64,
                paddingHorizontal: 32,
                rowGap: 16,
            }}
        >
            <View
                style={{
                    width: "100%",
                    aspectRatio: 1,
                    backgroundColor: "gray",
                    borderRadius: 7,
                }}
            />
            <View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: 16,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                        numberOfLines={1}
                    >
                        {currentTrack.name ? currentTrack.name : "No name"}
                    </Text>
                    <TouchableOpacity onPress={handleLikeButtonPress}>
                        <MaterialIcons
                            name={
                                currentTrack.isLiked
                                    ? "favorite"
                                    : "favorite-border"
                            }
                            size={24}
                            color="red"
                        />
                    </TouchableOpacity>
                </View>
                <Text style={{ textAlign: "center" }}>
                    {currentTrack.author ? currentTrack.author : "No author"},{" "}
                    {currentTrack.date ? currentTrack.date : "No date"}
                </Text>
            </View>
            <PlaybackControls
                isPlaying={isPlaying}
                play={play}
                pause={pause}
                next={next}
                previous={previous}
                skipPosition={skipPosition}
                trackPosition={trackPosition}
                trackDuration={trackDuration}
                shuffle={shuffle}
                playlist={playlist}
            />
        </View>
    );
}
