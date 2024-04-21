import { Link, Stack } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { mainStyles } from "../../Components/styles";
import PlaybackControls from "../../Components/PlaybackControls";

export default function YTmp3Tab() {
    return (
        <>
            <View style={mainStyles.container}>
                <Text>ytmp3</Text>
            </View>
            <PlaybackControls isMini={true} />
        </>
    );
}
