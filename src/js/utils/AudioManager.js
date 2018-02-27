class AudioManager {

    constructor(game) {
        this.soundVolume = DEFAULT_SOUND_VOLUME;
        this.mute = false;
        this.game = game;
        this.isMusicPlaying = false;
        this.isSoundPlaying = false;
        this.currentMusic = null;
        this.currentSounds = [];
        this.musicFading = DEFAULT_MUSIC_FADING;
    }

    playMusic(name, fade) {
        if (this.mute) return;
        let leFade = fade || this.musicFading;
        if (this.currentMusic) {
            this.currentMusic.fadeOut(leFade);
            setTimeout(() => {
                this.currentMusic.destroy();
                this._playMusic(name, leFade);
            }, this.leFade);
        } else {
            this._playMusic(name, leFade);
        }
    }

    playSound(name) {
        if (this.mute) return;
        let sound = this.game.add.audio(name);
        this.currentSounds.push(sound);
        let idSound = this.currentSounds.length - 1;
        sound.onDecoded.add(() => {
            sound.play('', 0, this.game.parameters.soundVolume.value / 10, false);
            this.isSoundPlaying = true;
            sound.onStop.add(() => {
                this.isSoundPlaying = false;
                this.currentSounds.splice(idSound, 1);
            });
        });
    }

    stopCurrentMusic(fade) {
        let leFade = fade || this.musicFading;

        if (this.currentMusic && this.isMusicPlaying) {
            this.currentMusic.fadeOut(leFade);
            setTimeout(() => {
                this.currentMusic.destroy();
                this.isMusicPlaying = false;
            }, leFade);
        }
    }

    stop() {
        if (this.isMusicPlaying && this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
            this.isMusicPlaying = false;
        }
        if (this.isSoundPlaying) {
            for (let i = 0; i < this.currentSounds.length; i++) {
                this.currentSounds[i].stop();
            }
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
            this.currentMusic.fadeTo(fade, (this.game.parameters.musicVolume.value / 10));
        });
    }
}