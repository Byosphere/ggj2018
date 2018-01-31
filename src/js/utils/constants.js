/* GENERAL */
const DEBUG = false;
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 896;
const CELL_SIZE = 64;
const ORANGE = 'orange';
const GREEN = 'green';
const RED = 'red';
const WHITE = 'white';
const CONTROLLER = false;
const DEFAULT_CURSOR_POSITION = 'fleur';

const TEXT_FR = {
    GENERIC_PRESS_BUTTON: 'Appuie sur ',
    GENERIC_TO_START: 'pour commencer',
    LOADING_TEXT: 'Chargement...',
    LOBBY_TEXT_CONNECTING: 'Tentative de connexion...',
    LOBBY_TEXT_CONNECTED: 'Connexion établie avec le serveur',
    LOBBY_TEXT_CODE_INSTRUCTIONS: "Donne ce code à ton partenaire de jeu pour qu'il retrouve !",
    LOBBY_TEXT_INSTRUCTIONS: 'Sélectionnez une option pour retrouver votre compagnon de jeu !',
    LOBBY_TEXT_CREATE: 'Créer un salon',
    LOBBY_TEXT_JOIN: 'Rejoindre un salon',
    MENU_TEXT_CODE: 'Code du salon',
    MENU_TEXT_WAITING: 'En attente des joueurs',
    MENU_TEXT_FLEUR: 'L\'est trop chou, Fleur !',
    MENU_TEXT_COLI: 'L\'est son bro, Coli.',
    MENU_TEXT_PAUSE: 'PAUSE',
    MENU_TEXT_RESET: 'réinitialise le niveau',
    P1: '<- J1',
    P2: '<- J2',
    PAD_ACTION_BUTTON: 'le bouton A',
    PAD_UP_BUTTON: 'le bouton haut',
    PAD_DOWN_BUTTON: 'le bouton bas',
    PAD_LEFT_BUTTON: 'le bouton gauche',
    PAD_RIGHT_BUTTON: 'le bouton droite',
    PAD_START_BUTTON: 'le bouton start',
    PAD_CANCEL_BUTTON: 'le bouton B',
    KEY_ACTION_BUTTON: 'la touche ENTREE',
    KEY_UP_BUTTON: 'la touche Z',
    KEY_DOWN_BUTTON: 'la touche S',
    KEY_LEFT_BUTTON: 'la touche Q',
    KEY_RIGHT_BUTTON: 'la touche D',
    KEY_START_BUTTON: 'la barre espace',
    KEY_CANCEL_BUTTON: 'la touche ESC',
}

/* COLORS & FONTS */
const LOADER_BACKGROUND = '#000';
const MENU_BACKGROUND_COLOR = '#1d2b53';
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

const NB_LEVELS = 7;

/* OBJECTS */

const HEROS_WIDTH = 1;
const HEROS_HEIGHT = 1;
const HEROS_SITTING_FRAME = 8;
const COLI_HEROS = 'coli';
const FLEUR_HEROS = 'fleur';

const DOOR_WIDTH = 1;
const DOOR_HEIGHT = 3;

const BUTTON_HEIGHT = 1;
const BUTTON_WIDTH = 1;

const ROCK_WIDTH = 1;
const ROCK_HEIGHT = 1;

const EXIT_WIDTH = 3;
const EXIT_HEIGHT = 3;

/* BUTTONS */
const ACTION = 'action';
const UP = 'up';
const DOWN = 'down';
const LEFT = 'left';
const RIGHT = 'right';
const CANCEL = 'cancel';
const START = 'start';