import React, { forwardRef, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSongsStore } from "../../store/songs";
import { SnapPoints, Spacing } from "../../styles/constants";
import SongListItem from "../SongListItem";
import ListItemsNotFound from "../UI/ListItemsNotFound";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SheetModalLayout } from "./SheetModalLayout";
import { BottomSheetProps } from "../../types/other";

const AddSongsToContainer = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const {
            songs,
            selectedContainer,

            addSongToPlaylist,
            addSongToAlbum,

            removeSongFromPlaylist,
            removeSongFromAlbum,
        } = useSongsStore();
        const [selectedSongs, setselectedSongs] = useState<string[]>([]);

        useEffect(() => {
            if (!selectedContainer) return;
            setselectedSongs(selectedContainer.songs);
        }, [selectedContainer]);

        if (selectedContainer === undefined) return;

        const containerType =
            selectedContainer?.id[0] === "P" ||
            parseInt(selectedContainer?.id[0]) == 1
                ? "playlist"
                : "album";

        const changeList = (songId: string) => {
            if (selectedSongs.includes(songId)) {
                setselectedSongs(selectedSongs.filter((id) => id !== songId));
                containerType === "album"
                    ? removeSongFromAlbum(selectedContainer.id, songId)
                    : removeSongFromPlaylist(selectedContainer.id, songId);
                return;
            }

            setselectedSongs([...selectedSongs, songId]);
            containerType === "album"
                ? addSongToAlbum(selectedContainer.id, songId)
                : addSongToPlaylist(selectedContainer.id, songId);
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Add songs to ${containerType}`}
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
                        paddingBottom: Spacing.xl * 3,
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

export default AddSongsToContainer;
