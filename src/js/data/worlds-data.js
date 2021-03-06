const WORLDS_DATA = [
    {
        id: 1,
        name: 'laserWorld',
        unlock_pattern: [[], [2, 11], [3], [4], [5], [6, 12], [7], [8], [9], [10]],
        to_unlock: 0,
        world_position: { x: 210, y: 110 },
        backgroundColor: '#3b1d00',
        story_texts: [
            { level: 1, text: ['TEXT_1_1_1', 'TEXT_1_1_2', 'TEXT_1_1_3', 'TEXT_1_1_4'] }
        ]
    },
    {
        id: 2,
        name: 'forestWorld',
        unlock_pattern: [[], [12], [13], [14], [15], [16], [17]],
        to_unlock: 0,
        world_position: { x: 145, y: 175 },
        backgroundColor: '#134c82',
        story_texts: [
            { level: 1, text: ['TEXT_2_1_1', 'TEXT_2_1_2'] }
        ]
    },
    {
        id: 3,
        name: '',
        unlock_pattern: [],
        backgroundColor: '#00000e',
        to_unlock: 16,
        world_position: { x: 338, y: 300 },
    },
    {
        id: 4,
        name: '',
        unlock_pattern: [],
        to_unlock: -1,
        world_position: { x: 214, y: 364  },
    },
    {
        id: 5,
        name: '',
        unlock_pattern: [],
        to_unlock: -1,
        world_position: { x: 342, y: 430 },
    },
    // {
    //     id: 7,
    //     name: '',
    //     unlock_pattern: [],
    //     to_unlock: -1,
    //     world_position: { x: 145, y: 175 },
    // },
    // {
    //     id: 7,
    //     name: '',
    //     unlock_pattern: [],
    //     to_unlock: -1,
    //     world_position: { x: 145, y: 175 },
    // },
    // {
    //     id: 8,
    //     name: '',
    //     unlock_pattern: [],
    //     to_unlock: -1,
    //     world_position: { x: 145, y: 175 },
    // },
    // {
    //     id: 9,
    //     name: '',
    //     unlock_pattern: [],
    //     to_unlock: -1,
    //     world_position: { x: 145, y: 175 },
    // },
    // {
    //     id: 10,
    //     name: '',
    //     unlock_pattern: [],
    //     to_unlock: -1,
    //     world_position: { x: 145, y: 175 },
    // },
];