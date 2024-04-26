import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import { useSongsStore } from "../store/songs";
import AlbumArt from "./AlbumArt";
import IconButton from "./UI/IconButton";
import { mainStyles, textStyles } from "./styles";
import FormatMillis from "./FormatMillis";

const PlaybackSlider = ({ trackDuration, trackPosition, skipPosition }) => {
    return (
        <Slider
            value={
                trackPosition && trackDuration
                    ? trackPosition / trackDuration
                    : 0
            }
            onSlidingComplete={async (value) => {
                await skipPosition(value);
            }}
            thumbTintColor="#E8DEF8"
            minimumTrackTintColor="#E8DEF8"
            maximumTrackTintColor="#E8DEF8"
        />
    );
};

const MiniPlaybackControls = () => {
    const {
        isPlaying,
        playlist,

        play,
        pause,
        next,
        previous,
        addSongLike,
        removeSongLike,

        skipPosition,
        trackPosition,
        trackDuration,

        currentTrack,
        getSong,
    } = useSongsStore();

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
        if (isPlaying) pause();
        else play();
    };

    const [songData, setSongData] = useState(getSong(currentTrack));
    useEffect(() => {
        setSongData(getSong(currentTrack));
    }, [currentTrack]);

    if (currentTrack === null || !songData) return;
    return (
        <TouchableNativeFeedback
            onPress={() => router.push("/(player)/" + currentTrack)}
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
                        image={songData.image}
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
                                {songData.name}
                            </Text>
                            <Text style={textStyles.detail} numberOfLines={1}>
                                {songData.artist
                                    ? songData.artist
                                    : "No artist"}
                                {"  •  "}
                                {songData.date ? songData.date : "No date"}
                            </Text>
                        </View>
                        <View style={{ marginTop: -13, marginLeft: -13 }}>
                            <IconButton
                                onPress={handleLikeButtonPress}
                                icon={
                                    songData.isLiked ? "heart" : "heart-outline"
                                }
                                size={18}
                            />
                        </View>
                        <View style={{ flexDirection: "row", columnGap: 16 }}>
                            <IconButton
                                onPress={previous}
                                icon="skip-previous"
                                size={36}
                            />
                            <IconButton
                                onPress={hanldePlayPausePress}
                                icon={isPlaying ? "pause" : "play"}
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
                    trackDuration={trackDuration}
                    trackPosition={trackPosition}
                    skipPosition={skipPosition}
                />
            </View>
        </TouchableNativeFeedback>
    );
};

const PlaybackControls = ({ isMini = false }) => {
    if (isMini) return <MiniPlaybackControls />;

    const {
        isPlaying,
        playlist,

        play,
        pause,
        next,
        previous,

        skipPosition,
        trackPosition,
        trackDuration,

        shuffle,
        repeat,
        turnOnRepeat,
        turnOffRepeat,
    } = useSongsStore();

    const hanldePlayPausePress = () => {
        if (isPlaying) pause();
        else play();
    };

    const handleRepeatPress = () => {
        if (repeat) turnOffRepeat();
        else turnOnRepeat();
    };

    return (
        <View
            style={{
                flexDirection: "column",
                justifyContent: "center",
                rowGap: 8,
            }}
        >
            <Text style={[textStyles.small, { textAlign: "center" }]}>
                {playlist.name}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <IconButton onPress={shuffle} icon={"shuffle"} size={32} />
                <IconButton
                    onPress={previous}
                    icon={"skip-previous"}
                    size={48}
                />
                <IconButton
                    onPress={hanldePlayPausePress}
                    icon={isPlaying ? "pause-circle" : "play-circle"}
                    size={64}
                />
                <IconButton onPress={next} icon={"skip-next"} size={48} />
                <IconButton
                    onPress={handleRepeatPress}
                    icon={repeat ? "repeat-once" : "repeat-off"}
                    size={32}
                />
            </View>
            <PlaybackSlider
                trackDuration={trackDuration}
                trackPosition={trackPosition}
                skipPosition={skipPosition}
            />
            <Text style={[textStyles.detail, { textAlign: "center" }]}>
                {FormatMillis(trackPosition)} / {FormatMillis(trackDuration)}
            </Text>
        </View>
    );
};
export default PlaybackControls;
