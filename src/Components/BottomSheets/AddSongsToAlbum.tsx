import React, { forwardRef, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSongsStore } from "../../store/songs";
import { SnapPoints, Spacing } from "../../styles/constants";
import SongListItem from "../SongListItem";
import ListItemsNotFound from "../UI/ListItemsNotFound";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SheetModalLayout } from "./SheetModalLayout";
import { BottomSheetProps } from "../../types/other";

const AddSongsToAlbum = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { songs, selectedAlbum, addSongToAlbum, removeSongFromAlbum } =
            useSongsStore();
        const [selectedSongs, setselectedSongs] = useState<string[]>([]);

        useEffect(() => {
            if (!selectedAlbum) return;
            setselectedSongs(selectedAlbum.songs);
        }, [selectedAlbum]);

        if (!selectedAlbum) return;

        const changeList = (songId: string) => {
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
            <SheetModalLayout
                ref={ref}
                title={`Add songs to ${selectedAlbum.title}`}
                snapPoints={[SnapPoints.full]}
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
            </SheetModalLayout>
        );
    }
);

export default AddSongsToAlbum;
