import { create } from "zustand";
import TrackPlayer, { RepeatMode, Track } from "react-native-track-player";
import { router } from "expo-router";
import { Song } from "../types/song";
import { DEFAULT_REPEAT_MODE, SECONDS_DISABLE_SKIP } from "../types/other";
import { useSongsStore } from "./songsStore";
import useTrack from "../hooks/useActiveTrack";

interface PlaybackState {
    repeatMode: RepeatMode;
}

interface PlaybackActions {
    // Core playback controls
    resetPlayer: () => Promise<void>;
    startup: () => Promise<void>;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    next: () => Promise<void>;
    previous: () => Promise<void>;
    seekToPosition: (position: number) => Promise<void>;
    shuffle: () => Promise<void>;

    // Song management
    toggleLike: (id: string) => void;

    // Repeat mode management
    setRepeatMode: (mode: RepeatMode) => Promise<void>;
    cycleRepeatMode: () => Promise<void>;

    // Queue management
    getQueue: () => Promise<Song[]>;
    setQueue: (queue: Track[]) => Promise<boolean>;
    emptyQueue: () => Promise<void>;
    addToQueue: (
        songs: Song[],
        options?: {
            redirect?: boolean;
            insertBefore?: number;
            shuffle?: boolean;
            playImmediately?: boolean;
            startFromIndex?: number;
        }
    ) => Promise<void>;
    removeFromQueue: (ids: string[]) => Promise<void>;
    moveQueueItem: (from: number, to: number) => Promise<void>;
}

const initialState: PlaybackState = {
    repeatMode: DEFAULT_REPEAT_MODE,
};

export const usePlaybackStore = create<PlaybackState & PlaybackActions>()(
    (set, get) => ({
        ...initialState,

        resetPlayer: async () => {
            await TrackPlayer.reset();
        },

        startup: async () => {
            set({
                repeatMode: await TrackPlayer.getRepeatMode(),
            });
        },

        play: async () => {
            await TrackPlayer.play();
        },

        pause: async () => {
            await TrackPlayer.pause();
        },

        next: async () => {
            const songStore = useSongsStore.getState();
            await TrackPlayer.skipToNext();
        },

        previous: async () => {
            const playbackProgress = await TrackPlayer.getProgress();

            if (playbackProgress.position > SECONDS_DISABLE_SKIP) {
                return await TrackPlayer.seekTo(0);
            }

            await TrackPlayer.skipToPrevious();
        },

        seekToPosition: async (position) => {
            await TrackPlayer.seekTo(position);
        },

        setRepeatMode: async (mode) => {
            await TrackPlayer.setRepeatMode(mode);
            set({ repeatMode: mode });
        },

        cycleRepeatMode: async () => {
            const current = await TrackPlayer.getRepeatMode();
            let setRepeat: RepeatMode;

            switch (current) {
                case RepeatMode.Off:
                    setRepeat = RepeatMode.Queue;
                    break;
                case RepeatMode.Queue:
                    setRepeat = RepeatMode.Track;
                    break;
                case RepeatMode.Track:
                    setRepeat = RepeatMode.Off;
                    break;
                default:
                    setRepeat = RepeatMode.Off;
                    break;
            }
            await TrackPlayer.setRepeatMode(setRepeat);
            set({ repeatMode: setRepeat });
        },

        getQueue: async () => {
            const queue = await TrackPlayer.getQueue();
            const songStore = useSongsStore.getState();

            return queue
                .map((track) => {
                    const song = songStore.getSong(track.id);
                    if (!song) {
                        console.warn(
                            `Song with id ${track.id} not found in store`
                        );
                        return null;
                    }
                    return song;
                })
                .filter((song): song is Song => song !== null);
        },

        setQueue: async (queue: Track[]) => {
            try {
                await TrackPlayer.reset();
                await TrackPlayer.add(queue);
                return true;
            } catch (error) {
                console.error("Failed to set queue:", error);
                return false;
            }
        },

        emptyQueue: async () => {
            try {
                await TrackPlayer.reset();
            } catch (error) {
                console.error("Failed to empty queue:", error);
            }
        },

        addToQueue: async (songs: Song[], options = {}) => {
            const {
                redirect = false,
                insertBefore,
                shuffle = false,
                playImmediately = false,
                startFromIndex = 0,
            } = options;

            try {
                let songsToAdd = [...songs];

                if (shuffle) {
                    songsToAdd = songsToAdd.sort(() => Math.random() - 0.5);
                }

                if (playImmediately) {
                    await TrackPlayer.reset();
                    await TrackPlayer.add(songsToAdd);

                    if (startFromIndex > 0) {
                        await TrackPlayer.skip(startFromIndex);
                    }

                    await TrackPlayer.play();

                    // Only add to conscious history if we're actually starting from this song
                    const songStore = useSongsStore.getState();
                    songStore.addSongToConsciousHistory(
                        songsToAdd[startFromIndex].id
                    );
                } else if (insertBefore !== undefined) {
                    await TrackPlayer.add(songsToAdd, insertBefore);
                } else {
                    await TrackPlayer.add(songsToAdd);
                }

                if (redirect) {
                    router.push("/overlays/player");
                }
            } catch (error) {
                console.error("Failed to add to queue:", error);
            }
        },

        removeFromQueue: async (ids: string[]) => {
            try {
                const queue = await TrackPlayer.getQueue();

                // Find indices to remove
                const indicesToRemove = queue
                    .map((track, index) =>
                        ids.includes(track.id) ? index : -1
                    )
                    .filter((index) => index !== -1)
                    .reverse(); // Remove from end to start to maintain indices

                // Remove tracks one by one
                for (const index of indicesToRemove) {
                    await TrackPlayer.remove(index);
                }
            } catch (error) {
                console.error("Failed to remove from queue:", error);
            }
        },

        moveQueueItem: async (from: number, to: number) => {
            try {
                await TrackPlayer.move(from, to);
            } catch (error) {
                console.error("Failed to move queue item:", error);
            }
        },

        shuffle: async () => {
            const queue = await TrackPlayer.getQueue();
            const currentIndex = await TrackPlayer.getActiveTrackIndex();

            if (!queue.length || currentIndex === undefined) return;

            const currentSong = queue[currentIndex];
            const remainingTracks = [
                ...queue.slice(0, currentIndex),
                ...queue.slice(currentIndex + 1),
            ];

            const shuffledTracks = remainingTracks.sort(
                () => Math.random() - 0.5
            );

            const newQueue = [
                ...shuffledTracks.slice(0, currentIndex),
                currentSong,
                ...shuffledTracks.slice(currentIndex),
            ];

            await TrackPlayer.removeUpcomingTracks();
            await TrackPlayer.add(newQueue.slice(currentIndex + 1));
        },

        toggleLike: async (trackId: string) => {
            const songStore = useSongsStore.getState();
            const song = songStore.getSong(trackId);
            if (!song) return;

            // Toggle like in song store
            if (song.rating) {
                songStore.unlikeSong(trackId);
            } else {
                songStore.likeSong(trackId);
            }

            try {
                const queue = await TrackPlayer.getQueue();

                // Find all instances of the song in the queue and update their metadata
                const trackIndices = queue
                    .map((track, index) => (track.id === trackId ? index : -1))
                    .filter((index) => index !== -1);

                // Update metadata for each instance
                for (const index of trackIndices) {
                    await TrackPlayer.updateMetadataForTrack(index, {
                        rating: song.rating ? 0 : 1,
                    });
                }
            } catch (error) {
                console.error("Failed to update track metadata:", error);
            }
        },
    })
);
