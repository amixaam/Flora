import React, { forwardRef, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSongsStore } from "../../store/songs";
import { spacing } from "../../styles/constants";
import SongListItem from "../SongListItem";
import ListItemsNotFound from "../UI/ListItemsNotFound";
import SheetLayout from "./SheetLayout";

const AddSongsToAlbum = forwardRef(({ props }, ref) => {
    const { songs, selectedAlbum, addSongToAlbum, removeSongFromAlbum } =
        useSongsStore();

    const [selectedSongs, setselectedSongs] = useState([]);

    useEffect(() => {
        setselectedSongs(selectedAlbum.songs);
    }, [selectedAlbum]);

    const changeList = (songId) => {
        if (selectedSongs.includes(songId)) {
            setselectedSongs(selectedSongs.filter((id) => id !== songId));
            removeSongFromAlbum(selectedAlbum.id, songId);
            return;
        }
        setselectedSongs([...selectedSongs, songId]);
        addSongToAlbum(selectedAlbum.id, songId);
        console.log(selectedSongs);
    };

    return (
        <SheetLayout
            ref={ref}
            title={`Add songs to ${selectedAlbum.title}`}
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
                        isSelectMode={true}
                        showImage={true}
                        isSelected={selectedSongs.includes(item.id)}
                        onSelect={() => changeList(item.id)}
                        onPress={changeList}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
        </SheetLayout>
    );
});

export default AddSongsToAlbum;
