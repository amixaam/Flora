import { Link, Stack } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { mainStyles, textStyles } from "../../Components/styles";
import PlaybackControls from "../../Components/PlaybackControls";

export default function YTmp3Tab() {
    return (
        <>
            <View style={[mainStyles.container, { padding: 16 }]}>
                <Text style={textStyles.h4}>
                    Download your music from Seal, for now!
                </Text>
            </View>
            <PlaybackControls isMini={true} />
        </>
    );
}
