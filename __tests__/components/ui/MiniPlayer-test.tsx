import { render } from "@testing-library/react-native";
import React from "react";
import { usePlaybackState, useProgress } from "react-native-track-player";
import MiniPlayer from "../../../src/Components/UI/UI chunks/MiniPlayer";
import { useSongsStore } from "../../../src/store/songsStore";
import { testSongObject } from "../../../src/utils/TestData";

jest.mock("../../../src/store/songsStore", () => ({
    useSongsStore: jest.fn(),
}));

jest.mock("react-native-track-player", () => ({
    __esModule: true,
    usePlaybackState: jest.fn(),
    useProgress: jest.fn(),
}));

describe("MiniPlayer", () => {
    beforeEach(() => {
        // @ts-ignore
        (useSongsStore as jest.Mock).mockReturnValue({
            next: jest.fn(),
            previous: jest.fn(),
            activeSong: testSongObject,
        });

        (usePlaybackState as jest.Mock).mockReturnValue("playing");
        (useProgress as jest.Mock).mockReturnValue({
            position: 0,
            buffered: 0,
            duration: 0,
        });
    });

    it("does not render when there is no active song", () => {
        // @ts-ignore
        (useSongsStore as jest.Mock).mockReturnValue({
            next: jest.fn(),
            previous: jest.fn(),
            activeSong: null,
        });

        const { getByTestId } = render(<MiniPlayer />);

        expect(() => getByTestId("mini-player")).toThrow();
    });

    it("renders when there is an active song", () => {
        const { getByTestId } = render(<MiniPlayer />);

        expect(getByTestId("album-art")).toBeTruthy();
        expect(getByTestId("mini-player")).toBeTruthy();
    });

    // it("calls next when skip button is pressed", () => {
    //     const { getByTestId } = render(<MiniPlayer />);
    //     fireEvent.press(getByTestId("skip-button-next"));
    //     expect(useSongsStore().next).toHaveBeenCalled();
    // });

    // it("calls previous when skip button is pressed", () => {
    //     const { getByTestId } = render(<MiniPlayer />);
    //     fireEvent.press(getByTestId("skip-button-previous"));
    //     expect(useSongsStore().previous).toHaveBeenCalled();
    // });

    // it("calls openPlayer when mini player is pressed", () => {
    //     const { getByTestId } = render(<MiniPlayer />);
    //     fireEvent.press(getByTestId("mini-player"));
    //     expect(router.push).toHaveBeenCalledWith("/overlays/player");
    // });

    // it("calls skipAnimation when mini player is swiped", () => {
    //     const { getByTestId } = render(<MiniPlayer />);
    //     fireEvent.panResponderGrant(getByTestId("mini-player"), {
    //         nativeEvent: { translationX: 100 },
    //     });
    //     expect(skipAnimation).toHaveBeenCalledWith(1);
    // });

    // it("calls resetPosition when mini player is swiped less than threshold", () => {
    //     const { getByTestId } = render(<MiniPlayer />);
    //     fireEvent.panResponderGrant(getByTestId("mini-player"), {
    //         nativeEvent: { translationX: 30 },
    //     });
    //     expect(resetPosition).toHaveBeenCalled();
    // });
});
