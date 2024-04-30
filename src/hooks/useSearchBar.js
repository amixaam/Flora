import { useNavigation } from "expo-router";
import React from "react";
import { colors } from "../styles/constants";

const useSearchBar = (placeholder = "Search...") => {
    const [search, setSearch] = React.useState("");
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                headerIconColor: colors.primary,
                textColor: colors.primary,
                barTintColor: colors.secondary,
                hintTextColor: colors.primary90,
                shouldShowHintSearchIcon: false,
                placeholder: placeholder,
                onChangeText: (event) => setSearch(event.nativeEvent.text),
            },
        });
    }, [navigation]);

    return search;
};

export default useSearchBar;
