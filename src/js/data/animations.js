/* mettre ici les animations possibles des elements : ID : {NAME: nom_d_anim, FRAMES: tableau des images de l'anim} */
const HEROS_ANIMATIONS = {
    TALK: { NAME: 'talk', FRAMES: [0, 1] },
    JUMP: { NAME: 'jump', FRAMES: [2, 3, 4, 5, 6] },
    SIT: { NAME: 'sit', FRAMES: 8 },
    DANCE: { NAME: 'dance', FRAMES: [9, 10, 11, 12] },
    WALK_RIGHT: { NAME: 'walk_right', FRAMES: [13, 14, 15, 16] },
    CRY: { NAME: 'cry', FRAMES: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27] },
    CARRY_RIGHT: { NAME: 'carry_right', FRAMES: [28, 29, 30, 31] },
    WALK_UP: { NAME: 'walk-up', FRAMES: [32, 33, 34, 35] },
    WALK_LEFT: { NAME: 'walk_left', FRAMES: [36, 37, 38, 39] },
    HIGHLIGHT: { NAME: 'highlight', FRAMES: [40, 41, 42, 43, 44] }
}

const DOOR_ANIMATIONS = {
    OPEN: { NAME: 'open' },
    CLOSE: { NAME: 'close' },
    GREEN_OPEN: { NAME: 'open', FRAMES: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
    GREEN_CLOSE: { NAME: 'close', FRAMES: [29, 28, 27, 26, 25, 24, 23, 22, 21, 20] },
    ORANGE_OPEN: { NAME: 'open', FRAMES: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
    ORANGE_CLOSE: { NAME: 'close', FRAMES: [19, 18, 17, 16, 15, 14, 13, 12, 11, 10] },
    RED_OPEN: { NAME: 'open', FRAMES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    RED_CLOSE: { NAME: 'close', FRAMES: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] },
    WHITE_OPEN: { NAME: 'open', FRAMES: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39] },
    WHITE_CLOSE: { NAME: 'close', FRAMES: [39, 38, 37, 36, 35, 34, 33, 32, 31, 30] }
}

const BUTTON_ANIMATIONS = {
    GREEN_BUTTON: { NAME: 'green_button', FRAMES: 4 },
    ORANGE_BUTTON: { NAME: 'orange_button', FRAMES: 2 },
    RED_BUTTON: { NAME: 'red_button', FRAMES: 0 },
    WHITE_BUTTON: { NAME: 'white_button', FRAMES: 6 }
}