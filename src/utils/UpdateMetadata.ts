import { AudioFile } from "expo-tag-reader/build/ExpoTagReader.types";
import * as MediaLibrary from "expo-media-library";
import * as TagReader from "expo-tag-reader";
import { Album, Song } from "../types/song";
import { createAlbumId, useSongsStore } from "../store/songsStore";

export const UpdateMetadata = async () => {
    useSongsStore.getState().setIsReadingSongs(true);
    const songIds = useSongsStore.getState().getSongIds();

    await loadNewAudioFiles(songIds);
    await checkDeletedFiles(songIds);
    useSongsStore.getState().setIsReadingSongs(false);
};

async function RequestReadPermissions() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
        alert(
            "Permission to access media library was denied. To view songs, please allow access."
        );
        return;
    }
}

async function checkDeletedFiles(ids: string[]) {
    await RequestReadPermissions();
    const removedIds = await TagReader.getRemovedAudioFiles(ids);

    if (removedIds.length > 0) {
        useSongsStore.getState().removeSongs(removedIds);
        console.log("Removed audio files: ", removedIds);
    } else {
        console.log("No removed audio files found");
    }
}

async function loadNewAudioFiles(songIds: string[]) {
    const pageSize = 5;
    let pageNumber = 1;
    let allAudioFiles: AudioFile[] = [];
    let currentPage: AudioFile[];

    await RequestReadPermissions();

    const startTime = Date.now();

    do {
        currentPage = await TagReader.readNewAudioFiles(
            songIds,
            pageSize,
            pageNumber
        );
        pageNumber++;

        allAudioFiles = allAudioFiles.concat(currentPage);
    } while (currentPage.length === pageSize);

    const endTime = Date.now();
    console.log(
        `METADATA // Read ${allAudioFiles.length} audio files in ${
            endTime - startTime
        }ms`
    );

    if (allAudioFiles.length > 0) {
        saveGivenAudioFiles(allAudioFiles);
    }
}

const saveGivenAudioFiles = (audioFiles: AudioFile[]) => {
    const newSongs: Song[] = [];
    const albumMap: {
        [key: string]: { songs: string[]; data: Partial<Album> };
    } = {};
    const existingAlbums = useSongsStore
        .getState()
        .getAllAlbums()
        .reduce((obj, album) => {
            obj[album.title] = album.id;
            return obj;
        }, {} as { [key: string]: string });

    audioFiles.forEach((file) => {
        const tags = file.tags;
        const songId = file.internalId;
        const albumTitle = tags.album || "Unknown Album";
        const albumArtist = tags.artist || "Unknown Artist";

        if (!albumMap[albumTitle]) {
            const albumId =
                existingAlbums[albumTitle] ||
                createAlbumId(albumTitle, albumArtist);
            albumMap[albumTitle] = {
                songs: [],
                data: {
                    id: albumId,
                    artist: albumArtist || "Unknown Artist",
                    year: tags.year
                        ? tags.year.substring(0, 4)
                        : "Unknown Year",
                    artwork: tags.albumArt,
                },
            };
        }

        albumMap[albumTitle].songs.push(songId);

        const song: Song = {
            id: songId,
            albumIds: [albumMap[albumTitle].data.id as string],
            url: file.uri,
            extension: file.extension,
            duration: parseInt(tags.duration),
            title:
                tags.title || file.fileName.split(".").slice(0, -1).join("."),
            artist: tags.artist || "Unknown Artist",
            year: tags.year ? tags.year.substring(0, 4) : "Unknown Year",
            sampleRate: parseInt(tags.sampleRate),
            bitRate: parseInt(tags.bitrate),
            channels: parseInt(tags.channels),
            trackNumber: tags.track ? parseInt(tags.track) : undefined,
            artwork: tags.albumArt as string,
            isLiked: false,
            isHidden: false,
            statistics: {
                creationDate: file.creationDate,
                lastPlayed: undefined,
                playCount: 0,
                skipCount: 0,
                lastModified: undefined,
            },
        };

        newSongs.push(song);
    });

    const albumsToAdd: { [key: string]: Partial<Album> } = {};
    const songIdsToAdd: { [key: string]: string[] } = {};

    Object.entries(albumMap).forEach(([title, { songs, data }]) => {
        if (!existingAlbums[title]) {
            albumsToAdd[title] = {
                ...data,
                title,
                songs,
                lastModified: new Date().toString(),
                createdAt: new Date().toString(),
            };
            songIdsToAdd[title] = songs;
        }
    });

    useSongsStore.getState().addSongs(newSongs);
    useSongsStore.getState().addAlbums(albumsToAdd, songIdsToAdd);
};
