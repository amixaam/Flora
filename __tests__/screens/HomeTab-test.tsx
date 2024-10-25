import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { router } from "expo-router";
import { useSongsStore } from "../../src/store/songsStore";
import {
    testSongObject,
    testAlbumObject,
    testPlaylistObject,
} from "../../src/utils/TestData";
import HomeTab from "../../src/app/(tabs)/(home)";
import { Text, View } from "react-native";
import { MainHeader } from "../../src/Components/UI/Headers/MainHeader";

// Mock the required modules
jest.mock("expo-router", () => ({
    router: {
        push: jest.fn(),
    },
}));

jest.mock("../../src/Components/UI/Headers/MainHeader", () => ({
    MainHeader: () => "Flora",
}));

jest.mock("../../src/store/songsStore", () => ({
    useSongsStore: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
    useSafeAreaInsets: () => ({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }),
}));

const mockBottomSheetRef = {
    current: {
        present: jest.fn(),
        dismiss: jest.fn(),
    },
};

jest.mock("@gorhom/bottom-sheet", () => {
    const ActualBottomSheet = jest.requireActual("@gorhom/bottom-sheet");
    return {
        ...ActualBottomSheet,
        BottomSheetModal: "BottomSheetModal",
    };
});


describe("HomeTab", () => {
    const mockSongsStore = {
        getRecentlyPlayed: jest
            .fn()
            .mockReturnValue([testAlbumObject, testPlaylistObject]),
        getRecentlyAddedSongs: jest.fn().mockReturnValue([testSongObject]),
        setSelectedContainer: jest.fn(),
        setSelectedSong: jest.fn(),
        addListToQueue: jest.fn(),
        shuffleList: jest.fn(),
        getSongsFromContainer: jest.fn().mockReturnValue([testSongObject]),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // @ts-ignore
        (useSongsStore as jest.Mock).mockReturnValue(mockSongsStore);
    });

    it("renders correctly with all main components", () => {
        const { getByText, toJSON } = render(<HomeTab />);

        expect(getByText("Recently added songs")).toBeTruthy();
        expect(getByText("Recently played")).toBeTruthy();

        expect(toJSON()).toMatchSnapshot();
    });

    describe("RecapBanner", () => {
        it("navigates to recap screen when pressed", () => {
            const { getByText } = render(<HomeTab />);

            fireEvent.press(getByText("Your Recap is here!"));

            expect(router.push).toHaveBeenCalledWith("overlays/recap");
        });
    });

    describe("HorizontalList", () => {
        it("shuffles songs when header shuffle button is pressed", () => {
            const { getAllByTestId } = render(<HomeTab />);
            const shuffleButtons = getAllByTestId("shuffle-button");

            fireEvent.press(shuffleButtons[0]); // Recently added songs shuffle

            expect(mockSongsStore.shuffleList).toHaveBeenCalledWith([
                testSongObject,
            ]);
        });

        it("navigates to container detail when container item is pressed", () => {
            const { getAllByTestId } = render(<HomeTab />);
            const containerItems = getAllByTestId("container-item");

            fireEvent.press(containerItems[1], "onPress"); // Recently played container

            expect(router.push).toHaveBeenCalledWith(
                `/${testPlaylistObject.id}`
            );
        });

        it("opens container sheet on long press of container", async () => {
            const { getAllByTestId } = render(<HomeTab />);
            const containerItems = getAllByTestId("container-item");

            fireEvent(containerItems[1], "onLongPress");

            expect(mockSongsStore.setSelectedContainer).toHaveBeenCalledWith(
                testPlaylistObject
            );
        });

        it("opens song sheet on long press of song", async () => {
            const { getAllByTestId } = render(<HomeTab />);
            const songItems = getAllByTestId("container-item");

            await fireEvent(songItems[0], "onLongPress");

            expect(mockSongsStore.setSelectedSong).toHaveBeenCalledWith(
                testSongObject
            );
        });

        // it("adds song to queue when song item is pressed", () => {
        //     const { getAllByTestId } = render(<HomeTab />);
        //     const songItems = getAllByTestId("container-item");

        //     fireEvent.press(songItems[0]);

        //     expect(mockSongsStore.addListToQueue).toHaveBeenCalledWith(
        //         [testSongObject],
        //         testSongObject,
        //         true
        //     );
        // });
    });

    describe("Data fetching", () => {
        it("fetches recently played and recently added songs on mount", () => {
            render(<HomeTab />);

            expect(mockSongsStore.getRecentlyPlayed).toHaveBeenCalled();
            expect(mockSongsStore.getRecentlyAddedSongs).toHaveBeenCalled();
        });
    });
});
