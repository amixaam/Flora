import { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useEffect, useState } from "react";
import { Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSongsStore } from "../../store/songs";
import SongListItem from "../SongListItem";
import { textStyles } from "../styles";
import SheetLayout from "./SheetLayout";

const ChangeMultipleSongPlaylistStatus = forwardRef(({ props }, ref) => {
    const {
        songs,
        selectedPlaylist,
        currentTrack,
        addSongToPlaylist,
        removeSongFromPlaylist,
    } = useSongsStore();
    const [selectedSongs, setselectedSongs] = useState(selectedPlaylist.songs);

    useEffect(() => {
        setselectedSongs(selectedPlaylist.songs);
    }, [selectedPlaylist]);

    const changeList = (songId) => {
        if (selectedSongs.includes(songId)) {
            setselectedSongs(selectedSongs.filter((id) => id !== songId));
            removeSongFromPlaylist(selectedPlaylist.id, songId);
            return;
        }
        setselectedSongs([...selectedSongs, songId]);
        addSongToPlaylist(selectedPlaylist.id, songId);
        console.log(selectedSongs);
    };

    return (
        <SheetLayout ref={ref} title={`Add songs to ${selectedPlaylist.name}`}>
            <BottomSheetView style={{ marginHorizontal: -16 }}>
                <BottomSheetView style={{ height: "100%", marginBottom: -64 }}>
                    {songs.length === 0 && (
                        <Text
                            style={[
                                textStyles.text,
                                {
                                    textAlign: "center",
                                    marginVertical: 32,
                                },
                            ]}
                        >
                            There aren't any songs, Download some!
                        </Text>
                    )}
                    <FlatList
                        data={songs.filter((song) => !song.isHidden)}
                        extraData={selectedSongs}
                        estimatedItemSize={100}
                        renderItem={({ item }) => (
                            <SongListItem
                                item={item}
                                isSelected={selectedSongs.includes(item.id)}
                                onSelect={() => changeList(item.id)}
                                onPress={changeList}
                                isCurrentTrack={
                                    item.id === currentTrack ? true : false
                                }
                                isSelectMode={true}
                                showImage={true}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </BottomSheetView>
            </BottomSheetView>
        </SheetLayout>
    );
});

export default ChangeMultipleSongPlaylistStatus;
