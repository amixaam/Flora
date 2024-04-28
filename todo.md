# Things to do before adding anything completely new (v0.2.0 Roadmap)

## bugfixes

-   [x] [26.04.24] Remove expo-blur, replace with alternative - ImageBackground & LinearGradient
-   [x] [26.04.24] Working slider in player (fixed, as resulf of removing expo-blur)
-   [x] [26.04.24] Refresh player when selecting same song in a different playlist
-   [x] [26.04.24] Reactive like icon in player
-   [x] [26.04.24] Fix when skipping previous and the current songs position is above 1s, the current song isnt played back again
-   [x] [26.04.24] Fixed when hidden music would still be played when skipping next / previous
-   [x] [26.04.24] Fixed shuffle playing when theres no songs in the playlist
-   [x] [26.04.24] Default album art change to image, instead of linear gradient
-   [x] [26.04.24] Fix shuffle playing from bottom sheet always playing first song
-   [x] [26.04.24] Display song image in player (instead of playlist image)
-   [x] [26.04.24] Update code, modularize
-   [x] [26.04.24] Hide hidden songs in "add songs to playlist" sheet
-   [x] [27.04.24] Pressing on the whole song list item in "add songs to playlist" now selects the song, instead of needing to press the checkbox

## New features

-   [x] [26.04.24] Play / shuffle button in playlists
-   [x] [26.04.24] Edit song in player
-   [x] [26.04.24] Confirmation modals
-   [x] [26.04.24] Delete playlist confirmation
-   [x] [26.04.24] Like button for mini player
-   [x] [26.04.24] Redesign song list item (+cover, +duration, +artist, +numeration)
-   [x] [26.04.24] Extra detail at the bottom of a playlist screen
-   [x] [26.04.24] Artist and date fields for playlists
-   [x] [27.04.24] Inherit playlist metadata to playlist songs option (bottom sheet option to apply)
-   [x] [27.04.24] Splash screen, IOS and Android icons
-   [x] [27.04.24] New font

## Some other time

-   [ ] YTmp3 tab
-   [ ] Mini player in playlist screen
-   [ ] Delete song option in edit song bottom sheet
-   [ ] notifications / lockscreen music controller
-   [ ] Haptics
-   [ ] Sleep timer

## Requests from testers

-   [ ] FEATURE: Add new playlist button on add song to playlist bottom sheet

## Bugs from testers

-   [ ] FIX: When playlist ends, playback controlls do nothing
-   [ ] FIX: Image edit crash??
-   [ ] FIX: Undefined variable when clicking on edit button (when you havent long-pressed a song list item first)
-   [ ] FIX: Song list shenanigens

# v0.3.0 Roadmap

## New features

-   [ ] (backend) Move from asyncStorage to Sqlite (sql injection safe)
-   [ ] Albums and Singles (Album tab)
-   [ ] Playing queue (Add songs, playlists, albums to playing queue)
-   [ ] Background music playback
-   [ ] Read audio file metadata from downloads
-   [ ] Edit specific song metadata

-   [ ] View song statistics (& more statistics)
-   [ ] Refresh song list function
-   [ ] Ask to update song metadata from playlist when editing playlist
-   [ ] Dynamic top bar
-   [ ] Playlist, Song and Album sorting
-   [ ] Apply audio file metadata option in bottom sheet (1 time thing)

-   [ ] TESTER REQ: Add new playlist option to add song to playlist bottom sheet
-   [ ] (backend) Variable bottom sheet sizes

## Bug fixes

-   [ ] Playback from song screen fully working
-   [ ] Song names are set appropriately (instead of file name)
-   [ ] Make bottom sheets dissapear on universal back button
-   [ ] Check for deleted audio files, and removing them from app storage
-   [ ] Remove date picker, in favor of a regular text input

-   [ ] TESTER REQ: Playback controls not working when playlist ends
-   [ ] TESTER REQ: state timing, shows error for undefined or null items

## Teaks

-   [ ] "Shuffle play", "Edit playlist" and "Add songs to playlist" options are box shaped and at the top
-   [ ] Removed "Update songs with playlist metadata" option
-   [ ] Playback scrollbar is thicker and aligns with content horizontally
-   [ ] "Delete playlist" option icon is a trash can
-   [ ] Font styling
-   [ ] Margin error fix on tab bar when mini player is not shown
