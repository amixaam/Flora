import TrackPlayer, { Event } from "react-native-track-player";
import { useSongsStore } from "./src/store/songsStore";

export const PlaybackService = async function () {
    const handleTrackChange = async (trackId) => {
        if (!trackId) return;
        useSongsStore.getState().batchUpdateTrack(trackId);
    };

    TrackPlayer.addEventListener(Event.RemotePlay, () => {
        TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
        TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemoteStop, () => {
        TrackPlayer.stop();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
        const track = await TrackPlayer.getActiveTrack();
        if (track) {
            useSongsStore.getState().updateSongSkip(track.id);
        }
        await TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        const playbackProgress = await TrackPlayer.getProgress();

        if (playbackProgress.position >= 3) {
            await TrackPlayer.seekTo(0);
        } else {
            await TrackPlayer.skipToPrevious();
        }
    });

    TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
        await TrackPlayer.seekBy(event.interval);
    });

    TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
        await TrackPlayer.seekBy(-event.interval);
    });

    TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
        TrackPlayer.seekTo(event.position);
    });

    let updateTimeout;
    let previousTrackId;
    let previousTimestamp = Date.now();

    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
        if (!event.track) return;

        // Clear any pending updates
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }

        const condition =
            previousTrackId !== event.track.id ||
            Date.now() - previousTimestamp >= 1000;

        if (condition) {
            // Debounce the update to prevent rapid consecutive updates
            updateTimeout = setTimeout(() => {
                handleTrackChange(event.track.id);
                previousTrackId = event.track.id;
                previousTimestamp = Date.now();
            }, 100);
        }
    });
};
