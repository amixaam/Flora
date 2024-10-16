import TrackPlayer, { Event } from "react-native-track-player";
import { useSongsStore } from "./src/store/songs";

export const PlaybackService = async function () {
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
        await TrackPlayer.skipToNext();

        useSongsStore.getState().updateSongSkip(track.id);
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

    let previousTrackId;
    let previousTimestamp = Date.now();
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
        useSongsStore.getState().updateActiveSong(event.track.id);

        const condition =
            previousTrackId !== event.track?.id ||
            Date.now() - previousTimestamp >= 1000;

        if (event.track && condition) {
            useSongsStore.getState().updateSongStatistics(event.track.id);
            useSongsStore.getState().addSongToHistory(event.track.id);
            previousTrackId = event.track.id;
            previousTimestamp = Date.now();
        }
    });
};
