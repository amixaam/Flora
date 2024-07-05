import { router, useNavigation } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSongsStore } from "../../../store/songs";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import BackgroundImageAbsolute from "../../../Components/BackgroundImageAbsolute";
import CreatePlaylist from "../../../Components/BottomSheets/CreatePlaylist";
import PlaylistSheet from "../../../Components/BottomSheets/PlaylistSheet";
import IconButton from "../../../Components/UI/IconButton";
import { Spacing } from "../../../styles/constants";
import { mainStyles, newStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, Playlist } from "../../../types/song";
import Pluralize from "../../../utils/Pluralize";
import { CombineStrings } from "../../../utils/CombineStrings";

export default function PlaylistsTab() {
    const { playlists, albums } = useSongsStore();

    const insets = useSafeAreaInsets();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="plus"
                    touchableOpacityProps={{
                        onPress: () => {
                            openCreatePlaylist();
                        },
                    }}
                />
            ),
        });
    }, [navigation]);

    const CreatePlaylistRef = useRef<BottomSheetModal>(null);
    const openCreatePlaylist = useCallback(
        () => CreatePlaylistRef.current?.present(),
        []
    );
    const dismissCreatePlaylist = useCallback(
        () => CreatePlaylistRef.current?.dismiss(),
        []
    );

    const PlaylistOptionsRef = useRef<BottomSheetModal>(null);
    const openPlaylistOptions = useCallback(() => {
        PlaylistOptionsRef.current?.present();
    }, []);

    const dismissPlaylistOptions = useCallback(() => {
        PlaylistOptionsRef.current?.dismiss();
    }, []);

    return (
        <ScrollView style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <View style={{ paddingTop: insets.top * 2.1 }} />
            <View style={{ flex: 1, gap: Spacing.appPadding }}>
                <HomeHeader text="Recently played" />
                {/* Pin Liked songs playlist to first position */}
                {/* Limit to 10 entries */}
                <HorizontalList list={playlists} />
                <View style={{ gap: Spacing.sm }}>
                    <HomeHeader text="Mood board" />
                    <CategoriesSelector
                        buttons={["Sleep", "Focus", "Energize", "sad"]}
                    />
                </View>
                <HorizontalList list={albums} />
                <HomeHeader text="Most played" />
                <HomeHeader text="Recaps" />
            </View>

            <PlaylistSheet
                ref={PlaylistOptionsRef}
                dismiss={dismissPlaylistOptions}
            />
            <CreatePlaylist
                ref={CreatePlaylistRef}
                dismiss={dismissCreatePlaylist}
            />
        </ScrollView>
    );
}

type HorizontalListProps = {
    list?: (Playlist | Album)[];
};
const HorizontalList = ({ list = [] }: HorizontalListProps) => {
    return (
        <FlashList
            horizontal
            data={list}
            extraData={list}
            keyExtractor={(item) => item.id}
            estimatedItemSize={10}
            contentContainerStyle={{
                paddingHorizontal: Spacing.appPadding,
            }}
            ItemSeparatorComponent={() => (
                <View style={{ width: Spacing.appPadding }} />
            )}
            renderItem={({ item }) => (
                <PlaylistItem
                    item={item}
                    touchableProps={{
                        onPress: () => {
                            router.push(`./${item.id}`);
                        },
                        onLongPress: () => {},
                    }}
                />
            )}
        />
    );
};

type PlaylistItemProps = {
    item: Playlist | Album;
    touchableProps?: React.ComponentProps<typeof TouchableNativeFeedback>;
};

const PlaylistItem = ({ item, touchableProps = {} }: PlaylistItemProps) => {
    const width = 160;
    return (
        <TouchableNativeFeedback delayLongPress={250} {...touchableProps}>
            <View style={{ gap: Spacing.xs, width: width }}>
                <AlbumArt image={item.artwork} style={{ width: width }} />
                <View>
                    <Text style={textStyles.h6} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text
                        style={[textStyles.small, { width: "100%" }]}
                        numberOfLines={1}
                    >
                        {/* Differentiate between albums and playlists */}
                        {"artist" in item
                            ? CombineStrings([item.artist, item.year])
                            : Pluralize(item.songs.length, "song", "songs")}
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

const HomeHeader = ({ text = "Header" }) => {
    return (
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
            <View style={{ flexDirection: "row", gap: Spacing.xs }}>
                <IconButton icon="play" />
                <IconButton icon="shuffle" />
            </View>
        </View>
    );
};

type CategoriesSelectorProps = {
    touchableNativeProps?: React.ComponentProps<typeof TouchableNativeFeedback>;
    buttons: string[];
};
const CategoriesSelector = ({
    buttons = ["Chip 1", "Chip 2"],
    touchableNativeProps = {},
}: CategoriesSelectorProps) => {
    const [activeButton, setActiveButton] = useState(0);

    return (
        <View
            style={{
                flexDirection: "row",
                gap: Spacing.sm,
                paddingHorizontal: Spacing.appPadding,
            }}
        >
            {buttons.map((button, index) => (
                <Chip
                    key={button + index}
                    text={button}
                    touchableNativeProps={{
                        ...touchableNativeProps,
                        onPress: () => setActiveButton(index),
                    }}
                    selected={activeButton === index}
                />
            ))}
        </View>
    );
};

type ButtonProps = {
    touchableNativeProps?: React.ComponentProps<typeof TouchableNativeFeedback>;
    text: string;
    selected: boolean;
};

const Chip = ({
    text = "Chip",
    touchableNativeProps = {},
    selected = false,
}: ButtonProps) => {
    return (
        <TouchableNativeFeedback {...touchableNativeProps}>
            <View style={[newStyles.chip, selected && newStyles.chipSelected]}>
                <Text style={textStyles.small}>{text}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};
