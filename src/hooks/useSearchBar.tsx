import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Colors } from "../styles/constants";
import { SearchBarProps } from "react-native-screens";

const useSearchBar = (placeholder = "Search...") => {
    const [search, setSearch] = useState("");
    const navigation = useNavigation();

    const handleOnChangeText: SearchBarProps["onChangeText"] = ({
        nativeEvent: { text },
    }) => {
        setSearch(text);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                headerIconColor: Colors.primary,
                textColor: Colors.primary,
                barTintColor: Colors.secondary,
                hintTextColor: Colors.primary90,
                shouldShowHintSearchIcon: false,
                placeholder: placeholder,
                onChangeText: handleOnChangeText,
            },
        });
    }, [navigation]);

    return search;
};

export default useSearchBar;
