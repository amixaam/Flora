import { Text, View } from "react-native";
import { textStyles } from "../../../styles/text";
import SheetHeader from "./SheetHeader";
import { Colors, Spacing } from "../../../styles/constants";
import IconButton from "../Buttons/IconButton";
import { router } from "expo-router";
import { useSongsStore } from "../../../store/songsStore";
import { ActivityIndicator } from "react-native-paper";

interface MainHeaderProps {
    title?: string;
    headerRight?: React.ReactElement;
}

export const MainHeader = ({
    title = "Flora",
    headerRight,
}: MainHeaderProps) => {
    return (
        <SheetHeader
            title={title}
            titleStyle={textStyles.h4}
            headerLeft={<></>}
            headerRight={
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: Spacing.md,
                    }}
                >
                    {headerRight || <IconHeaders />}
                </View>
            }
        />
    );
};

const IconHeaders = () => {
    const { isReadingSongs } = useSongsStore();
    return (
        <>
            <ActivityIndicator
                animating={isReadingSongs}
                color={Colors.primary}
            />
            <IconButton
                testID="history-button"
                icon="history"
                onPress={() => router.push("/overlays/history")}
            />
            <IconButton
                testID="search-button"
                icon="magnify"
                onPress={() => router.push("/overlays/search")}
            />
        </>
    );
};
