import {
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from "react-native";
import { useSongsStore } from "../store/songs";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

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
            <View
                style={{
                    flexDirection: "column",
                    rowGap: 4,
                    margin: 8,
                    padding: 8,
                    backgroundColor: "white",
                    borderRadius: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: 8,
                    }}
                >
                    <LinearGradient
                        style={styles.GradientContainer}
                        colors={["pink", "lightblue"]}
                        start={{ x: -0.5, y: 0 }}
                        end={{ x: 1, y: 1.5 }}
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
                            <Text
                                style={{ fontWeight: "bold", fontSize: 16 }}
                                numberOfLines={1}
                            >
                                {currentTrack.name}
                            </Text>
                            <Text style={{ fontSize: 12 }} numberOfLines={1}>
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
                                <MaterialIcons name="skip-previous" size={36} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={hanldePlayPausePress}>
                                <MaterialIcons
                                    name={isPlaying ? "pause" : "play-arrow"}
                                    size={36}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={next}>
                                <MaterialIcons name="skip-next" size={36} />
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
                    thumbTintColor="black"
                    minimumTrackTintColor="black"
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

    const formatMilliseconds = (milliseconds) => {
        const minutes = Math.floor(milliseconds / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

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
                value={
                    trackPosition && trackDuration
                        ? trackPosition / trackDuration
                        : 0
                }
                onSlidingComplete={async (value) => {
                    await skipPosition(value);
                }}
                thumbTintColor="black"
                minimumTrackTintColor="black"
            />
            <Text style={styles.smallText}>
                {formatMilliseconds(trackPosition)} /{" "}
                {formatMilliseconds(trackDuration)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    smallText: {
        fontSize: 12,
        textAlign: "center",
    },
    GradientContainer: {
        height: 38,
        aspectRatio: 1,
        borderRadius: 5,
    },
});

export default PlaybackControls;
