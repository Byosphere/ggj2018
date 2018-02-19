/* GENERAL */
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 896;
const CELL_SIZE = 64;
const CONTROLLER = false;
const DEFAULT_CURSOR_POSITION = 'fleur';
const NB_LEVELS = 10;
const WORLDS = ['laserWorld', 'forestWorld'];
const UNLOCK_PATTERN = [
    [],
    [],
    [3],
    [4],
    [5],
    [6, 11]
]

/** Default values */
const DEFAULT_LANGUAGE = 0;
const DEFAULT_DEBUG_MODE = 0;
const DEFAULT_SOUND_VOLUME = 10;
const DEFAULT_MUSIC_VOLUME = 10;
const DEFAULT_MUSIC_FADING = 1000;

/* COLORS & FONTS */
const LOADER_BACKGROUND = '#000';
const MENU_BACKGROUND_COLOR = '#1d2b53';
const LOBBY_BACKGROUND = '#000';
const DEFAULT_FONT = 'normal 32px uni0553';
const DEFAULT_COLOR = '#FFF';
const LOADER_COLOR = '#FFF';
const MENU_TEXT_WAITING_COLOR = '#FFF';
const MENU_TEXT_FLEUR_COLOR = '#ffccaa';
const MENU_TEXT_COLI_FONT = 'normal 32px uni0553';
const MENU_TEXT_COLI_COLOR = '#00e756';
const SCENE_BACKGROUND = '#1d2b53';
const GAME_TEXT_NEXT_LEVEL = 'Appuie sur ';
const GAME_TEXT_NEXT_LEVEL_FONT = 'normal 40px uni0553';
const GAME_TEXT_NEXT_LEVEL_COLOR = '#FFF';
const HUGE_FONT = 'normal 120px uni0553';
const HEAD_FONT = 'normal 50px uni0553';
const BIG_FONT = 'normal 80px uni0553';
const SMALL_FONT = 'normal 20px uni0553';
const SMALLEST_FONT = 'normal 12px uni0553';

/* POSITIONING & SIZES */
const MENU_TITLE_HEIGHT = 150;
const BULLE_SKEW = 50;
const HEAD_TITLE_WIDTH = 444;
const HEAD_TITLE_HEIGHT = 276;
const VICTORY_WIDTH = 1200;
const VICTORY_HEIGHT = 800;
const CREDITS_HEIGHT = 1200;
const CREDITS_WIDTH = 800;
const MENU_HEROS_POS_Y = 350;
const WORLD_POSITIONS = [
    {},
    { x: 186, y: 80 },
    { x: 125, y: 145 },
    { x: 318, y: 270 },
];

/* OBJECTS */

const HEROS_WIDTH = 1;
const HEROS_HEIGHT = 1;
const HEROS_SITTING_FRAME = 8;
const HEROS_MAX_LIVES = 3;

const DOOR_WIDTH = 1;
const DOOR_HEIGHT = 3;

const BUTTON_HEIGHT = 1;
const BUTTON_WIDTH = 1;

const ROCK_WIDTH = 1;
const ROCK_HEIGHT = 1;

const EXIT_WIDTH = 3;
const EXIT_HEIGHT = 3;

/* CONSTANTS */
const ACTION = 'action';
const UP = 'up';
const DOWN = 'down';
const LEFT = 'left';
const RIGHT = 'right';
const CANCEL = 'cancel';
const START = 'start';
const COLI_HEROS = 'coli';
const FLEUR_HEROS = 'fleur';
const ORANGE = 'orange';
const GREEN = 'green';
const RED = 'red';
const WHITE = 'white';

/* DEBUG */
const DEBUG_LEVEL = 5;
const DEBUG_HEROS = COLI_HEROS;