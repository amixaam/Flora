import { useLocalSearchParams } from "expo-router";
import { ImageBackground, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import SongListItem from "../../Components/SongListItem";
import { useEffect, useRef } from "react";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";
import { useSongsStore } from "../../store/songs";
import AlbumArt from "../../Components/AlbumArt";
import { mainStyles } from "../../Components/styles";
import Animated from "react-native-reanimated";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
// import { getColors } from "react-native-image-colors";

export default function PlaylistList() {
    const { playlist } = useLocalSearchParams();
    const {
        getPlaylist,
        addSongLike,
        removeSongLike,
        setSelectedSong,
        currentTrack,
    } = useSongsStore();

    const playlistData = getPlaylist(playlist);

    useEffect(() => {
        console.log("[playlist] renew");
    }, []);

    const bottomSheetRef = useRef(null);
    const handleEditSong = () => bottomSheetRef.current.present();

    return (
        <ScrollView style={mainStyles.container}>
            <View
                style={{
                    width: "100%",
                    height: 360,
                    position: "absolute",
                    flex: 1,
                }}
            >
                <View style={{ position: "relative", height: "100%", flex: 1 }}>
                    {!playlistData.image && (
                        <LinearGradient
                            colors={["pink", "lightblue"]}
                            start={{ x: -0.5, y: 0 }}
                            end={{ x: 1, y: 1.5 }}
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                opacity: 0.5,
                            }}
                        />
                    )}
                    <ImageBackground
                        source={{ uri: playlistData.image }}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            opacity: 0.8,
                        }}
                        resizeMode="cover"
                        blurRadius={30}
                    />
                    <LinearGradient
                        colors={[
                            "#050506",
                            "#05050666",
                            "#05050655",
                            "#05050699",
                            "#050506",
                        ]}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                        }}
                    />
                </View>
            </View>
            <View
                style={{
                    padding: 16,
                    alignItems: "center",
                    rowGap: 4,
                }}
            >
                <AlbumArt
                    image={playlistData.image}
                    width={250}
                    aspectRatio={1}
                    borderRadius={7}
                />
                <Animated.Text
                    sharedTransitionTag={playlistData.name}
                    style={mainStyles.text_24}
                >
                    {playlistData.name}
                </Animated.Text>
                <Text style={mainStyles.text_12}>
                    {playlistData.description}
                </Text>
            </View>
            {playlistData.songs.length === 0 && (
                <Text style={[mainStyles.text_16, { textAlign: "center" }]}>
                    Add songs to this playlist to view them!
                </Text>
            )}
            <View style={{ flex: 1, minHeight: 200 }}>
                <FlashList
                    data={playlistData.songs}
                    estimatedItemSize={100}
                    renderItem={({ item }) =>
                        SongListItem(
                            { item },
                            addSongLike,
                            removeSongLike,
                            handleEditSong,
                            setSelectedSong,
                            item.id === currentTrack.id ? true : false
                        )
                    }
                    keyExtractor={(item) => item.id}
                />
            </View>
            <EditSongBottomSheet ref={bottomSheetRef} />
        </ScrollView>
    );
}
