import { Text, View } from "react-native";
import { textStyles } from "../../../styles/text";
import SheetHeader from "./SheetHeader";
import { Colors, Spacing } from "../../../styles/constants";
import IconButton from "../Buttons/IconButton";
import { router } from "expo-router";
import { useSongsStore } from "../../../store/songs";
import { ActivityIndicator } from "react-native-paper";

interface MainHeaderProps {
    title?: string;
    headerRight?: React.ReactNode;
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
            headerRight={<IconHeaders headerRight={headerRight} />}
        />
    );
};

const IconHeaders = ({ headerRight }: { headerRight?: React.ReactNode }) => {
    const { isReadingSongs } = useSongsStore();
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing.md,
            }}
        >
            {headerRight}
            <ActivityIndicator
                animating={isReadingSongs}
                color={Colors.primary}
            />
            <IconButton
                icon="history"
                touchableOpacityProps={{
                    onPress: () => router.push("/overlays/history"),
                }}
            />
            <IconButton
                icon="magnify"
                touchableOpacityProps={{
                    onPress: () => router.push("/overlays/search"),
                }}
            />
        </View>
    );
};
