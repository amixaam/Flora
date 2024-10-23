import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import PlaybackControls from "../../../src/Components/UI/UI chunks/PlaybackControls";
import { RepeatMode } from "react-native-track-player";
import { Direction } from "../../../src/types/other";

let mockPlaybackState = { state: "playing" };
let mockProgress = { position: 65, buffered: 0, duration: 180 };

const mockPlaybackActions = {
    play: jest.fn().mockImplementation(() => {
        mockPlaybackState.state = "playing";
    }),
    pause: jest.fn().mockImplementation(() => {
        mockPlaybackState.state = "paused";
    }),
    next: jest.fn(),
    previous: jest.fn(),
    seekToPosition: jest.fn(),
    shuffle: jest.fn(),
    toggleRepeatMode: jest.fn(),
    repeatMode: RepeatMode.Off,
};

jest.mock("../../../src/store/songsStore", () => ({
    useSongsStore: () => mockPlaybackActions,
}));

jest.mock("react-native-track-player", () => ({
    RepeatMode: {
        Off: 0,
        Track: 1,
        Queue: 2,
    },
    usePlaybackState: () => mockPlaybackState,
    useProgress: () => mockProgress,
}));

describe("PlaybackControls", () => {
    const mockAnimation = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockPlaybackState = { state: "playing" };
        mockProgress = { position: 65, buffered: 0, duration: 180 };
    });

    it("renders correctly", () => {
        const { getByTestId, toJSON } = render(
            <PlaybackControls animation={mockAnimation} />
        );

        expect(getByTestId("repeat-button-container")).toBeTruthy();
        expect(getByTestId("previous-button-container")).toBeTruthy();
        expect(getByTestId("play-pause-button-container")).toBeTruthy();
        expect(getByTestId("next-button-container")).toBeTruthy();
        expect(getByTestId("shuffle-button-container")).toBeTruthy();

        expect(toJSON()).toMatchSnapshot();
    });

    it("toggles between play and pause", () => {
        const { getByTestId, rerender } = render(
            <PlaybackControls animation={mockAnimation} />
        );

        const playPauseButton = getByTestId("play-pause-button");

        expect(mockPlaybackState.state).toBe("playing");
        fireEvent.press(playPauseButton);
        expect(mockPlaybackActions.pause).toHaveBeenCalled();
        expect(mockPlaybackState.state).toBe("paused");

        rerender(<PlaybackControls animation={mockAnimation} />);

        fireEvent.press(playPauseButton);
        expect(mockPlaybackActions.play).toHaveBeenCalled();
        expect(mockPlaybackState.state).toBe("playing");
    });

    it("triggers next with animation", () => {
        const { getByTestId } = render(
            <PlaybackControls animation={mockAnimation} />
        );

        fireEvent.press(getByTestId("next-button"));

        expect(mockPlaybackActions.next).toHaveBeenCalled();
        expect(mockAnimation).toHaveBeenCalledWith(Direction.LEFT, true);
    });

    it("triggers previous with animation when position > 3 seconds", () => {
        mockProgress = { ...mockProgress, position: 10 };

        const { getByTestId } = render(
            <PlaybackControls animation={mockAnimation} />
        );

        fireEvent.press(getByTestId("previous-button"));

        expect(mockPlaybackActions.previous).toHaveBeenCalled();
        expect(mockAnimation).not.toHaveBeenCalled();
    });

    it("triggers previous with animation when position < 3 seconds", () => {
        mockProgress = { ...mockProgress, position: 2 };

        const { getByTestId } = render(
            <PlaybackControls animation={mockAnimation} />
        );

        fireEvent.press(getByTestId("previous-button"));

        expect(mockPlaybackActions.previous).toHaveBeenCalled();
        expect(mockAnimation).toHaveBeenCalledWith(Direction.RIGHT, true);
    });

    it("triggers shuffle", () => {
        const { getByTestId } = render(<PlaybackControls />);

        fireEvent.press(getByTestId("shuffle-button"));
        expect(mockPlaybackActions.shuffle).toHaveBeenCalled();
    });

    it("triggers repeat mode toggle", () => {
        const { getByTestId } = render(<PlaybackControls />);

        fireEvent.press(getByTestId("repeat-button"));
        expect(mockPlaybackActions.toggleRepeatMode).toHaveBeenCalled();
    });

    it("displays correct time format", () => {
        const { getByText } = render(<PlaybackControls />);

        expect(getByText("01:05")).toBeTruthy(); // Current position
        expect(getByText("-01:55")).toBeTruthy(); // Time remaining
    });
});
