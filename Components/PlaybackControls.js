import {
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from "react-native";
import { useSongsStore } from "../store/songs";
import Slider from "@react-native-community/slider";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AlbumArt from "./AlbumArt";
import { mainStyles } from "./styles";
import Animated, { FadeInDown } from "react-native-reanimated";

const MiniPlaybackControls = () => {
    const {
        play,
        pause,
        isPlaying,
        next,
        previous,
        skipPosition,
        trackPosition,
        trackDuration,
        currentTrack,
        playlist,
    } = useSongsStore();

    const hanldePlayPausePress = () => {
        if (isPlaying) pause();
        else play();
    };

    if (currentTrack.length === 0) return;
    return (
        <TouchableNativeFeedback
            onPress={() => router.push("/(player)/" + currentTrack.id)}
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
                            <Text style={mainStyles.text_16} numberOfLines={1}>
                                {currentTrack.name}
                            </Text>
                            <Text style={mainStyles.text_10} numberOfLines={1}>
                                {currentTrack.artist
                                    ? currentTrack.artist
                                    : "No artist"}
                                ,{" "}
                                {currentTrack.date
                                    ? currentTrack.date
                                    : "no date"}
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
        play,
        pause,
        isPlaying,
        next,
        previous,
        skipPosition,
        trackPosition,
        trackDuration,
        shuffle,
        playlist,
        currentTrack,
        repeat,
        turnOnRepeat,
        turnOffRepeat,
    } = useSongsStore();

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

    const handleRepeatPress = () => {
        if (repeat) turnOffRepeat();
        else turnOnRepeat();
    };

    const formatMilliseconds = (milliseconds) => {
        const minutes = Math.floor(milliseconds / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(200)}
            style={{
                flexDirection: "column",
                justifyContent: "center",
                rowGap: 8,
            }}
        >
            <Text style={[mainStyles.text_12, { textAlign: "center" }]}>
                {playlist.name}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity onPress={handleShufflePress}>
                    <MaterialCommunityIcons
                        name="shuffle"
                        size={32}
                        style={mainStyles.color_text}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSkipPreviousPress}>
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
                <TouchableOpacity onPress={handleSkipNextPress}>
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
            <Text style={[mainStyles.text_10, { textAlign: "center" }]}>
                {formatMilliseconds(trackPosition)} /{" "}
                {formatMilliseconds(trackDuration)}
            </Text>
        </Animated.View>
    );
};

export default PlaybackControls;
