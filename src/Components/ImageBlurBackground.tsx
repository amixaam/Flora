import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Image,
    ImageBackground,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { Album, Playlist } from "../types/song";
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

interface ImageBlurBackgroundProps {
    image: Playlist["artwork"] | Album["artwork"];
    gradient?: React.ComponentProps<typeof LinearGradient>;
    style?: StyleProp<ViewStyle>;
    blur?: number;
    opacity?: SharedValue<number>;
}

const ImageBlurBackground = ({
    image,
    gradient = { colors: ["#050506", "#05050650", "#050506"] },
    style,
    blur = 20,
    opacity = useSharedValue(1),
}: ImageBlurBackgroundProps) => {
    const backup = require("../../assets/images/empty-cover.png");

    // Use animated style for opacity
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <View style={[styles.AbsoluteFill, style]}>
            <View
                style={{
                    position: "relative",
                    flex: 1,
                }}
            >
                <Animated.Image
                    source={image ? { uri: image } : backup}
                    style={[styles.AbsoluteFill, animatedStyle]}
                    resizeMode="cover"
                    blurRadius={blur}
                />
                <LinearGradient
                    style={styles.AbsoluteFill}
                    locations={[0.075, 0.5, 0.95]}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    {...gradient}
                />
                <LinearGradient
                    style={styles.AbsoluteFill}
                    locations={[0.075, 0.5, 0.95]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    {...gradient}
                />
                <LinearGradient
                    style={styles.AbsoluteFill}
                    locations={[0, 0.9, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={["#05050600", "#05050000", "#050506"]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    AbsoluteFill: {
        width: "100%",
        height: "100%",
        position: "absolute",
        flex: 1,
    },
});

export default ImageBlurBackground;
