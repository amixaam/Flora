import React, { forwardRef, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSongsStore } from "../../store/songs";
import { Spacing } from "../../styles/constants";
import SongListItem from "../SongListItem";
import ListItemsNotFound from "../UI/ListItemsNotFound";
import SheetLayout from "./SheetLayout";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const AddSongsToPlaylist = forwardRef<BottomSheetModal>(({}: any, ref) => {
    const {
        songs,
        selectedPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
    } = useSongsStore();
    const [selectedSongs, setselectedSongs] = useState<string[]>([]);

    useEffect(() => {
        if (!selectedPlaylist) return;

        setselectedSongs(selectedPlaylist.songs);
    }, [selectedPlaylist]);

    if (!selectedPlaylist) return;

    const changeList = (songId: string) => {
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
            title={`Add songs to ${selectedPlaylist.title}`}
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
                    paddingBottom: Spacing.xl,
                }}
                renderItem={({ item }) => (
                    <SongListItem
                        item={item}
                        isSelected={selectedSongs.includes(item.id)}
                        onSelect={() => changeList(item.id)}
                        onPress={() => {
                            changeList(item.id);
                        }}
                        isSelectMode={true}
                        showImage={true}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
        </SheetLayout>
    );
});

export default AddSongsToPlaylist;
