import { useLocalSearchParams } from "expo-router";
import { ImageBackground, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import SongListItem from "../../Components/SongListItem";
import { useEffect, useRef } from "react";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";
import { useSongsStore } from "../../store/songs";
import AlbumArt from "../../Components/AlbumArt";
import { mainStyles, textStyles } from "../../Components/styles";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PrimaryRoundIconButton from "../../Components/UI/PrimaryRoundIconButton";
import SecondaryRoundIconButton from "../../Components/UI/SecondaryRoundIconButton";
import EditPlaylistOptionsBottomSheet from "../../Components/BottomSheets/EditPlaylistOptionsBottomSheet";

export default function PlaylistList() {
    const { playlist } = useLocalSearchParams();
    const {
        getPlaylist,
        addSongLike,
        removeSongLike,
        setSelectedSong,
        currentTrack,
        loadTrack,
        getSongDataFromPlaylist,
    } = useSongsStore();

    const playlistData = getPlaylist(playlist);
    const songData = getSongDataFromPlaylist(playlist);

    const editSongSheetRef = useRef(null);
    const handleEditSong = () => editSongSheetRef.current.present();

    const editPlaylistSheetRef = useRef(null);
    const handleEditPlaylist = () => editPlaylistSheetRef.current.present();

    const handleShufflePress = () => {
        loadTrack(songData[0], playlistData, true);
    };

    const handlePlayPress = () => {
        loadTrack(songData[0], playlistData, false);
    };

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
                    rowGap: 8,
                }}
            >
                <AlbumArt
                    image={playlistData.image}
                    width={250}
                    aspectRatio={1}
                    borderRadius={7}
                />
                <View
                    style={{
                        marginVertical: 4,
                        rowGap: 4,
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Text style={[textStyles.h4, { textAlign: "center" }]}>
                        {playlistData.name}
                    </Text>
                    {playlistData.description && (
                        <Text
                            style={[
                                textStyles.text,
                                { textAlign: "center", opacity: 0.7 },
                            ]}
                        >
                            {playlistData.description}
                        </Text>
                    )}
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                        columnGap: 16,
                        alignItems: "center",
                    }}
                >
                    <SecondaryRoundIconButton
                        onPress={handleShufflePress}
                        icon="play"
                    />
                    <PrimaryRoundIconButton
                        size={40}
                        onPress={handlePlayPress}
                    />
                    <SecondaryRoundIconButton
                        icon="pencil"
                        onPress={handleEditPlaylist}
                    />
                </View>
            </View>
            {playlistData.songs.length === 0 && (
                <View
                    style={{
                        marginTop: 32,
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <MaterialCommunityIcons
                        name="playlist-remove"
                        size={48}
                        style={mainStyles.color_text}
                    />
                    <Text
                        style={[
                            textStyles.text,
                            { textAlign: "center", width: "75%" },
                        ]}
                    >
                        Add songs to this playlist by holding the song you want
                        and selecting this playlist!
                    </Text>
                </View>
            )}
            <View style={{ flex: 1, minHeight: 5 }}>
                <FlashList
                    data={songData}
                    estimatedItemSize={100}
                    renderItem={({ item }) => (
                        <SongListItem
                            item={item}
                            addSongLike={addSongLike}
                            removeSongLike={removeSongLike}
                            handleOpenPress={handleEditSong}
                            setSelectedSong={setSelectedSong}
                            isCurrentTrack={
                                item.id === currentTrack ? true : false
                            }
                        />
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View style={{ padding: 16, paddingBottom: 64 }}>
                <Text style={[textStyles.small, { textAlign: "center" }]}>
                    {playlistData.songs.length} songs
                </Text>
            </View>
            <EditSongBottomSheet ref={editSongSheetRef} />
            <EditPlaylistOptionsBottomSheet ref={editPlaylistSheetRef} />
        </ScrollView>
    );
}
