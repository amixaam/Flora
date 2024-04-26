# Things to do before adding anything completely new

## bugfixes

-   [x] Remove expo-blur, replace with alternative - ImageBackground & LinearGradient
-   [x] Working slider in player (fixed, as resulf of removing expo-blur)
-   [x] Refresh player when selecting same song in a different playlist
-   [x] Reactive like icon in player
-   [x] Fix when skipping previous and the current songs position is above 1s, the current song isnt played back again
-   [x] Fixed when hidden music would still be played when skipping next / previous
-   [x] Fixed shuffle playing when theres no songs in the playlist
-   [x] Default album art change to image, instead of linear gradient
-   [ ] Fix music playback, when selecting a song in local files, instead of a playlist
-   [ ] Fix shuffle playing from bottom sheet always playing first song

## New features

-   [x] Play / shuffle button in playlists
-   [x] Edit song in player
-   [x] Confirmation modals
-   [x] Delete playlist confirmation
-   [ ] Apply album art to all songs in a playlist modal
-   [ ] Refresh song list button in local
-   [ ] Display song image in player
-   [ ] Artist and date fields for playlists
-   [ ] haptics

## Postponed

-   [ ] Delete song option in edit song bottom sheet
-   [ ] Fix music stopping playing while in background
-   [ ] notifications / lockscreen music controller
-   [ ] Read audio file metadata to automatically insert album cover, artist ect..
