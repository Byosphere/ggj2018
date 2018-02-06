class AudioManager {

    constructor(game) {
        this.soundVolume = DEFAULT_SOUND_VOLUME;
        this.mute = false;
        this.game = game;
        this.isSoundPlaying = false;
        this.isMusicPlaying = false;
        this.currentMusic = null;
        this.musicFading = DEFAULT_MUSIC_FADING;
    }

    playMusic(name, fade) {
        if(this.mute) return;
        let leFade = fade || this.musicFading;
        if(this.currentMusic) {
            this.currentMusic.fadeOut(leFade);
            setTimeout(() => {
                this.currentMusic.destroy();
                this._playMusic(name, leFade);
            }, this.leFade);
        } else {
            this._playMusic(name, leFade);
        }
    }

    stopCurrentMusic(fade) {
        let leFade = fade || this.musicFading;

        if(this.currentMusic && this.isMusicPlaying) {
            this.currentMusic.fadeOut(leFade);
            setTimeout(() => {
                this.currentMusic.destroy();
                this.isMusicPlaying = false;
            }, leFade);
        }
    }

    getCurrentMusic() {
        return this.currentMusic;
    }

    _playMusic(name, fade) {
        this.isMusicPlaying = true;
        this.currentMusic = this.game.add.audio(name);
        this.currentMusic.onDecoded.add(() => {
            this.currentMusic.play('', 0, 0, true);
            this.currentMusic.fadeTo(fade, (this.game.parameters.musicVolume.value/10));
        });
    }
}