import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import {
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSongsStore } from "../store/songs";
import AlbumArt from "./AlbumArt";
import { mainStyles, textStyles } from "./styles";
import { useEffect, useState } from "react";

const formatMilliseconds = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
};

const MiniPlaybackControls = () => {
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

        currentTrack,
        getSong,
    } = useSongsStore();

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
                        image={playlist.image}
                        height={48}
                        aspectRatio={1}
                        borderRadius={5}
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
                            <Text style={textStyles.small} numberOfLines={1}>
                                {songData.artist
                                    ? songData.artist
                                    : "No artist"}
                                , {songData.date ? songData.date : "no date"}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", columnGap: 16 }}>
                            <TouchableOpacity onPress={previous}>
                                <MaterialCommunityIcons
                                    name="skip-previous"
                                    size={36}
                                    style={mainStyles.color_text}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={hanldePlayPausePress}>
                                <MaterialCommunityIcons
                                    name={isPlaying ? "pause" : "play"}
                                    size={36}
                                    style={mainStyles.color_text}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={next}>
                                <MaterialCommunityIcons
                                    name="skip-next"
                                    size={36}
                                    style={mainStyles.color_text}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
                <TouchableOpacity onPress={shuffle}>
                    <MaterialCommunityIcons
                        name="shuffle"
                        size={32}
                        style={mainStyles.color_text}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={previous}>
                    <MaterialCommunityIcons
                        name="skip-previous"
                        size={48}
                        style={mainStyles.color_text}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={hanldePlayPausePress}>
                    <MaterialCommunityIcons
                        name={isPlaying ? "pause-circle" : "play-circle"}
                        size={64}
                        style={mainStyles.color_text}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={next}>
                    <MaterialCommunityIcons
                        name="skip-next"
                        size={48}
                        style={mainStyles.color_text}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRepeatPress}>
                    <MaterialCommunityIcons
                        name={repeat ? "repeat-once" : "repeat-off"}
                        size={32}
                        style={mainStyles.color_text}
                    />
                </TouchableOpacity>
            </View>
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
            <Text style={[textStyles.detail, { textAlign: "center" }]}>
                {formatMilliseconds(trackPosition)} /{" "}
                {formatMilliseconds(trackDuration)}
            </Text>
        </View>
    );
};

export default PlaybackControls;
