import { Link, Stack, router } from "expo-router";
import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useSongsStore } from "../../store/songs";
import { useEffect, useRef } from "react";
import EditPlaylistOptionsBottomSheet from "../../Components/BottomSheets/EditPlaylistOptionsBottomSheet";
import {
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
    useFonts,
} from "@expo-google-fonts/poppins";
import PlaybackControls from "../../Components/PlaybackControls";
import { LinearGradient } from "expo-linear-gradient";

const PlaylistItem = ({ item }, handleOpenPress, setSelectedPlaylist) => {
    const handleLongPress = () => {
        setSelectedPlaylist(item);
        handleOpenPress();
    };

    const handlePress = () => {
        setSelectedPlaylist(item);
        router.push("/(playlist)/" + item.id);
    };
    return (
        <TouchableNativeFeedback
            onPress={handlePress}
            onLongPress={handleLongPress}
            delayLongPress={250}
        >
            <View
                style={{
                    margin: 4,
                    rowGap: 4,
                }}
            >
                <LinearGradient
                    colors={["pink", "lightblue"]}
                    start={{ x: -0.5, y: 0 }}
                    end={{ x: 1, y: 1.5 }}
                    style={{
                        width: "100%",
                        aspectRatio: 1,
                        borderRadius: 7,
                    }}
                />
                <View>
                    <Text
                        style={{
                            fontSize: 24,
                            fontFamily: "Poppins_600SemiBold",
                            lineHeight: 28,
                        }}
                        numberOfLines={1}
                    >
                        {item.name}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: "Poppins_500Medium",
                            marginTop: -4,
                        }}
                    >
                        {item.songs.length} songs
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default function PlaylistsTab() {
    const { playlists, setSelectedPlaylist, setSongs, setPlaylists } =
        useSongsStore();
    useEffect(() => {
        console.log("playlists renew");

        // setSongs([]);
        // setPlaylists([
        //     {
        //         id: "1",
        //         name: "Liked songs",
        //         description: "Your songs that you liked.",
        //         songs: [],
        //     },
        // ]);
    }, []);

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

    let [fontsLoaded, fontError] = useFonts({
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_500Medium,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={{ margin: 8, flex: 1, height: "100%" }}>
                <Text style={styles.greetingMessage}>Greeting message!</Text>
                <FlashList
                    numColumns={2}
                    data={playlists}
                    keyExtractor={(item) => item.id}
                    estimatedItemSize={100}
                    renderItem={({ item }) =>
                        PlaylistItem(
                            { item },
                            handleOpenPress,
                            setSelectedPlaylist
                        )
                    }
                />
            </View>
            <PlaybackControls isMini={true} />
            <EditPlaylistOptionsBottomSheet ref={bottomSheetRef} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flex: 1,
    },
    greetingMessage: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 24,
    },
});
