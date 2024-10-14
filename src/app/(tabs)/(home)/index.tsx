import { router } from "expo-router";
import { Text, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useSongsStore } from "../../../store/songs";

import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContainerSheet from "../../../Components/BottomSheets/Container/ContainerSheet";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, Playlist } from "../../../types/song";

import IconButton from "../../../Components/UI/Buttons/IconButton";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import ContainerItem from "../../../Components/UI/UI chunks/ContainerItem";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";

export default function HomeTab() {
    const { getRecentlyPlayed } = useSongsStore();
    const insets = useSafeAreaInsets();

    const {
        sheetRef: containerRef,
        open: openContainer,
        close: closeContainer,
    } = useBottomSheetModal();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />

            <ScrollView
                style={[
                    mainStyles.transparentContainer,
                    {
                        paddingBottom: insets.bottom + Spacing.miniPlayer,
                    },
                ]}
            >
                <MainHeader />
                <View style={{ flex: 1, gap: Spacing.md }}>
                    {/* feed */}
                    <FeedSection
                        text="Recently played"
                        list={getRecentlyPlayed()}
                        longPress={openContainer}
                    />
                </View>
            </ScrollView>
            <ContainerSheet ref={containerRef} dismiss={closeContainer} />
        </View>
    );
}

type FeedSectionProps = {
    text: string;
    list: (Album | Playlist)[];
    longPress: () => void;
};

const FeedSection = ({ text, list, longPress }: FeedSectionProps) => {
    return (
        <>
            <HomeHeader text={text} />
            <HorizontalList list={list} longPress={longPress} />
        </>
    );
};

// const RecapBanner = () => {
//     return (
//         <TouchableHighlight>
//             <ImageBackground
//                 source={RecapGradient}
//                 style={newStyles.recapBanner}
//                 imageStyle={{ borderRadius: Spacing.radiusLg }}
//             >
//                 <View
//                     style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         flex: 1,
//                         gap: Spacing.lg,
//                         paddingRight: Spacing.sm,
//                     }}
//                 >
//                     <View
//                         style={{
//                             flex: 1,
//                         }}
//                     >
//                         <Text style={textStyles.h5}>Your recap is here!</Text>
//                         <Text style={textStyles.small}>
//                             Find out what you’ve been listening to for the last
//                             month!
//                         </Text>
//                     </View>
//                     <IconButton icon="play" size={IconSizes.lg} />
//                 </View>
//             </ImageBackground>
//         </TouchableHighlight>
//     );
// };

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
                <View style={{ width: Spacing.md }} />
            )}
            renderItem={({ item }) => (
                <ContainerItem
                    style={{
                        width: 160,
                    }}
                    selectPadding={false}
                    item={item}
                    icon={{
                        onPress: async () => {
                            await setSelectedContainer(item);
                            longPress();
                        },
                    }}
                    onLongPress={async () => {
                        await setSelectedContainer(item);
                        longPress();
                    }}
                    onPress={() => router.push(`/${item.id}`)}
                />
            )}
        />
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
                marginTop: Spacing.md,
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
                <IconButton icon="play" />
                <IconButton icon="shuffle" />
            </View>
        </View>
    );
};
