import { router, useNavigation } from "expo-router";
import {
    ImageBackground,
    Text,
    TouchableNativeFeedback,
    View,
} from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSongsStore } from "../../../store/songs";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import BackgroundImageAbsolute from "../../../Components/BackgroundImageAbsolute";
import CreatePlaylist from "../../../Components/BottomSheets/CreatePlaylist";
import PlaylistSheet from "../../../Components/BottomSheets/PlaylistSheet";
import ContainerSheet from "../../../Components/BottomSheets/ContainerSheet";
import IconButton from "../../../Components/UI/IconButton";
import { IconSizes, Spacing } from "../../../styles/constants";
import { mainStyles, newStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, Playlist } from "../../../types/song";
import Pluralize from "../../../utils/Pluralize";
import { CombineStrings } from "../../../utils/CombineStrings";

import RecapGradient from "../../../../assets/images/recap-gradient.png";

export default function PlaylistsTab() {
    const { playlists, albums, getRecentlyPlayed } = useSongsStore();
    const insets = useSafeAreaInsets();

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

    const ContainerOptionsRef = useRef<BottomSheetModal>(null);
    const openContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.present();
    }, []);

    const dismissContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.dismiss();
    }, []);

    return (
        <ScrollView style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <View style={{ paddingTop: insets.top * 2.3 }} />

            <View style={{ flex: 1, gap: Spacing.appPadding }}>
                <RecapBanner />
                <HomeHeader text="Recently played" />
                {/* Pin Liked songs playlist to first position */}
                {/* Limit to 10 entries */}
                <HorizontalList
                    list={getRecentlyPlayed()}
                    longPress={openContainerOptions}
                />
                <View style={{ gap: Spacing.sm }}>
                    <HomeHeader text="Mood board" />
                    <CategoriesSelector
                        buttons={["Sleep", "Focus", "Energize", "sad"]}
                    />
                </View>
                <HorizontalList
                    list={albums}
                    longPress={openContainerOptions}
                />
                {/* <HomeHeader text="Most played" />
                <HomeHeader text="Recaps" /> */}
            </View>
            <View
                style={{ paddingBottom: insets.bottom + Spacing.miniPlayer }}
            />

            <PlaylistSheet
                ref={PlaylistOptionsRef}
                dismiss={dismissPlaylistOptions}
            />
            <CreatePlaylist
                ref={CreatePlaylistRef}
                dismiss={dismissCreatePlaylist}
            />
            <ContainerSheet
                ref={ContainerOptionsRef}
                dismiss={dismissContainerOptions}
            />
        </ScrollView>
    );
}

const RecapBanner = () => {
    return (
        <TouchableHighlight>
            <ImageBackground
                source={RecapGradient}
                style={newStyles.recapBanner}
                imageStyle={{ borderRadius: Spacing.radiusLg }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: 1,
                        gap: Spacing.lg,
                        paddingRight: Spacing.sm,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text style={textStyles.h5}>Your recap is here!</Text>
                        <Text style={textStyles.small}>
                            Find out what you’ve been listening to for the last
                            month!
                        </Text>
                    </View>
                    <IconButton icon="play" size={IconSizes.lg} />
                </View>
            </ImageBackground>
        </TouchableHighlight>
    );
};

type HorizontalListProps = {
    list?: (Playlist | Album)[];
    longPress?: () => void;
};
const HorizontalList = ({
    list = [],
    longPress = () => {},
}: HorizontalListProps) => {
    const { setSelectedContainer } = useSongsStore();

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
                        onLongPress: () => {
                            setSelectedContainer(item);
                            longPress();
                        },
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
                <Text style={textStyles.text}>{text}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};
