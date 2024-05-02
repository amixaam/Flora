import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useEffect, useState } from "react";
import { Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSongsStore } from "../../store/songs";
import { textStyles } from "../../styles/text";
import SongListItem from "../SongListItem";
import SheetLayout from "./SheetLayout";
import ListItemsNotFound from "../UI/ListItemsNotFound";
import { spacing } from "../../styles/constants";

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
        <SheetLayout
            ref={ref}
            title={`Add songs to ${selectedPlaylist.name}`}
            index={3}
        >
            <FlatList
                data={songs.filter((song) => !song.isHidden)}
                ListEmptyComponent={
                    <ListItemsNotFound
                        text="No songs found!"
                        icon="music-note"
                    />
                }
                contentContainerStyle={{
                    paddingBottom: spacing.xl,
                }}
                renderItem={({ item }) => (
                    <SongListItem
                        item={item}
                        isSelected={selectedSongs.includes(item.id)}
                        onSelect={() => changeList(item.id)}
                        onPress={changeList}
                        isCurrentTrack={item.id === currentTrack ? true : false}
                        isSelectMode={true}
                        showImage={true}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
        </SheetLayout>
    );
});

export default ChangeMultipleSongPlaylistStatus;
