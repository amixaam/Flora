import { router } from "expo-router";
import { ImageBackground, Text, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useSongsStore } from "../../../store/songsStore";

import { ScrollView } from "react-native-gesture-handler";
import ContainerSheet from "../../../Components/BottomSheets/Container/ContainerSheet";
import { Colors, ImageSources, Spacing } from "../../../styles/constants";
import { mainStyles, newStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, Playlist, Song } from "../../../types/song";

import { TouchableRipple } from "react-native-paper";
import SongSheet from "../../../Components/BottomSheets/Song/SongSheet";
import IconButton from "../../../Components/UI/Buttons/IconButton";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import ContainerItem from "../../../Components/UI/UI chunks/ContainerItem";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { usePlaybackStore } from "../../../store/playbackStore";

export default function HomeTab() {
    const {
        getRecentlyPlayed,
        getRecentlyAddedSongs,
        setSelectedContainer,
        setSelectedSong,
    } = useSongsStore();

    const {
        sheetRef: containerRef,
        open: openContainer,
        close: closeContainer,
    } = useBottomSheetModal();

    const {
        sheetRef: songRef,
        open: openSong,
        close: closeSong,
    } = useBottomSheetModal();

    const onContainerLongPress = async (container: Album | Playlist) => {
        await setSelectedContainer(container);
        openContainer();
    };
    const onSongLongPress = async (song: Song) => {
        await setSelectedSong(song);
        openSong();
    };

    const recentlyAddedSongs = getRecentlyAddedSongs();
    const recentlyPlayedItems = getRecentlyPlayed();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />

            <ScrollView
                style={[mainStyles.transparentContainer]}
                contentContainerStyle={{
                    paddingBottom: Spacing.miniPlayer * 2,
                }}
            >
                <MainHeader />
                <RecapBanner />
                <View style={{ marginTop: Spacing.md }}>
                    <HorizontalList
                        text="Recently added songs"
                        list={recentlyAddedSongs}
                        longPress={onSongLongPress}
                    />
                    <HorizontalList
                        text="Recently played"
                        list={recentlyPlayedItems}
                        longPress={onContainerLongPress}
                    />
                </View>
            </ScrollView>
            <ContainerSheet ref={containerRef} dismiss={closeContainer} />
            <SongSheet ref={songRef} dismiss={closeSong} />
        </View>
    );
}

type HorizontalListProps = {
    list?: (Playlist | Album | Song)[];
    longPress?: any;
    text?: string;
};

const HorizontalList = ({
    list = [],
    longPress,
    text = "List header",
}: HorizontalListProps) => {
    const { getSongsFromContainer } = useSongsStore();
    const { addToQueue } = usePlaybackStore();

    const isSongList = list.length > 0 && "sampleRate" in list[0];

    const getAllSongsFromContainers = (): Song[] => {
        return list
            .map((container) => getSongsFromContainer(container.id))
            .flat()
            .filter((s) => s !== undefined) as Song[];
    };

    const onHeaderPress = async () => {
        const songs = isSongList
            ? (list as Song[])
            : getAllSongsFromContainers();

        await addToQueue(songs, {
            shuffle: true,
            playImmediately: true,
            redirect: true,
        });
    };

    const onContainerPress = async (
        item: Playlist | Album | Song,
        index: number
    ) => {
        if (isSongList) {
            await addToQueue(list as Song[], {
                playImmediately: true,
                startFromIndex: index,
                redirect: true,
            });
            return;
        }

        // If containers, navigate to detail view
        router.push(`/${item.id}`);
    };

    return (
        <View
            style={{
                gap: Spacing.md,
                marginTop: Spacing.md,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: Spacing.appPadding,
                }}
            >
                <Text
                    style={[
                        textStyles.h5,
                        {
                            flex: 1,
                            marginRight: Spacing.md,
                        },
                    ]}
                    numberOfLines={1}
                >
                    {text}
                </Text>
                <View style={{ flexDirection: "row", gap: Spacing.md }}>
                    <IconButton
                        icon="shuffle"
                        testID="shuffle-button"
                        onPress={onHeaderPress}
                    />
                </View>
            </View>
            <FlashList
                horizontal
                data={list}
                keyExtractor={(item) => item.id}
                estimatedItemSize={10}
                contentContainerStyle={{
                    paddingHorizontal: Spacing.appPadding,
                }}
                ItemSeparatorComponent={() => (
                    <View style={{ width: Spacing.md }} />
                )}
                renderItem={({ item, index }) => (
                    <ContainerItem
                        style={{
                            width: 160,
                        }}
                        item={item}
                        icon={{
                            onPress: () => longPress(item),
                        }}
                        onLongPress={() => longPress(item)}
                        onPress={() => onContainerPress(item, index)}
                    />
                )}
            />
        </View>
    );
};

const RecapBanner = () => {
    const onPress = () => {
        router.push("overlays/recap");
    };

    return (
        <ImageBackground
            source={ImageSources.banner}
            style={newStyles.recapBanner}
        >
            <TouchableRipple
                onPress={onPress}
                style={[mainStyles.fullSize, { justifyContent: "flex-end" }]}
            >
                <View
                    style={{
                        padding: Spacing.appPadding,
                        backgroundColor: Colors.bg + "50",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={textStyles.h5}>Your Recap is here!</Text>
                    <IconButton
                        icon="arrow-right"
                        iconColor={Colors.primary}
                        onPress={onPress}
                    />
                </View>
            </TouchableRipple>
        </ImageBackground>
    );
};
