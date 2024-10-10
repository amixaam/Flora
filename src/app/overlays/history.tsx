import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Menu } from "react-native-paper";
import SongSheet from "../../Components/BottomSheets/Song/SongSheet";
import SongListItem from "../../Components/UI/UI chunks/SongListItem";
import SheetHeader from "../../Components/UI/Headers/SheetHeader";
import SwipeDownScreen from "../../Components/UI/Utils/SwipeDownScreen";
import useBottomSheetModal from "../../hooks/useBottomSheetModal";
import { useSongsStore } from "../../store/songs";
import { Colors } from "../../styles/constants";
import { Song } from "../../types/song";
import IconButton from "../../Components/UI/Buttons/IconButton";

const HistoryScreen = () => {
    const { history, getSong, setSelectedSong, addToQueueFirst } =
        useSongsStore();

    const {
        sheetRef: SongRef,
        open: openSong,
        close: dismissSong,
    } = useBottomSheetModal();

    return (
        <>
            <SwipeDownScreen>
                <SheetHeader title="History" headerRight={<MenuButton />} />
                <ScrollView>
                    {history.history.map((item) => {
                        const song = getSong(item.song);
                        if (!song) return null;

                        return (
                            <SongListItem
                                key={song.id}
                                item={song}
                                showImage
                                onPress={async () => {
                                    await setSelectedSong(song);
                                    addToQueueFirst(song);
                                }}
                                onLongPress={async () => {
                                    await setSelectedSong(song);
                                    openSong();
                                }}
                                onSecondaryButtonPress={async () => {
                                    await setSelectedSong(song);
                                    openSong();
                                }}
                                secondaryButtonIcon={"dots-vertical"}
                            />
                        );
                    })}
                </ScrollView>
            </SwipeDownScreen>
            <SongSheet ref={SongRef} dismiss={dismissSong} />
        </>
    );
};

const MenuButton = () => {
    const [visible, setVisible] = useState(false);

    const { getHistory, getSong, shuffleList, addToQueue } = useSongsStore();

    function getSongsFromHistory() {
        const history = getHistory().history;

        const songs: Song[] = history
            .map((historyItem) => {
                const song = getSong(historyItem.song);
                if (!song) return undefined;
                return song;
            })
            .filter((song) => song !== undefined) as Song[];

        return songs;
    }

    return (
        <Menu
            visible={visible}
            contentStyle={{ backgroundColor: Colors.input }}
            anchorPosition="bottom"
            onDismiss={() => setVisible(false)}
            anchor={
                <IconButton
                    icon={"dots-vertical"}
                    touchableOpacityProps={{
                        onPress: () => setVisible(true),
                    }}
                />
            }
        >
            <Menu.Item
                onPress={() => {
                    shuffleList(getSongsFromHistory());
                }}
                title="Shuffle"
                leadingIcon={"shuffle"}
                titleStyle={{ color: Colors.primary }}
            />
            <Menu.Item
                onPress={() => {
                    addToQueue(getSongsFromHistory());
                }}
                title="Add to queue"
                leadingIcon={"album"}
                titleStyle={{ color: Colors.primary }}
            />
            <Menu.Item
                title="Add to playlist"
                leadingIcon={"playlist-plus"}
                titleStyle={{ color: Colors.primary }}
            />
        </Menu>
    );
};

export default HistoryScreen;
