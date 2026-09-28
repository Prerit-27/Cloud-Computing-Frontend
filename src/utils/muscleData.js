/**
 * Anatomy data for the interactive body map.
 *
 * Every muscle is drawn as a LEFT-HALF path inside a 240 x 560 viewBox.
 * Paths with `mirror: true` are rendered twice — once as-is and once flipped
 * around the vertical centre line (x = 120) — so both sides always match.
 *
 * DJANGO NOTE: the geometry is pure presentation and should stay in the
 * frontend. Only `MUSCLE_LIBRARY` content (function / exercises / tips) is a
 * candidate for coming from the API later — see api.js -> getMuscles().
 */

/* Body outline: head -> outer arm -> hand -> inner arm -> torso -> leg -> foot
   -> back up the inner leg to the crotch, then closed along the centre line. */
export const BODY_OUTLINE =
  'M120,13 C108,13 99,22 99,36 C99,48 106,60 112,63 L112,74 ' +
  'C100,78 88,84 79,91 C64,96 50,109 49,127 ' +
  'C47,145 42,170 40,198 C37,226 33,257 31,284 ' +
  'C29,298 27,308 29,316 C33,322 42,322 46,314 ' +
  'C53,292 60,264 65,240 C70,216 75,192 80,170 ' +
  'C82,158 84,148 86,142 ' +
  'C90,162 92,182 94,202 C96,216 97,228 99,237 ' +
  'C92,245 86,253 86,267 C87,287 91,309 95,331 ' +
  'C99,357 103,375 105,389 C107,405 106,421 105,437 ' +
  'C104,463 106,487 108,505 C108,515 106,519 104,523 ' +
  'C96,527 88,529 87,535 C87,541 93,543 104,543 ' +
  'C112,543 114,539 114,529 C115,511 114,491 113,471 ' +
  'C112,447 114,421 115,401 C116,379 117,341 117,301 ' +
  'C117,287 118,277 119,268 L120,268 Z';

export const FRONT_MUSCLES = [
  {
    id: 'neck',
    label: 'Neck',
    color: '#5BE7FF',
    mirror: true,
    d: 'M113,62 C109,68 106,74 104,82 C109,86 114,84 116,78 C117,72 116,66 115,62 Z',
    labelAt: { x: 120, y: 72 },
  },
  {
    id: 'traps',
    label: 'Trapezius',
    color: '#B75BFF',
    mirror: true,
    d: 'M112,76 C100,80 88,86 77,94 C87,100 100,103 112,101 Z',
    labelAt: { x: 86, y: 88 },
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    color: '#5BE7FF',
    mirror: true,
    d: 'M80,92 C64,98 51,112 51,128 C56,139 74,140 82,131 C86,117 86,102 84,94 Z',
    labelAt: { x: 56, y: 118 },
  },
  {
    id: 'chest',
    label: 'Chest',
    color: '#7CFF5B',
    mirror: true,
    d: 'M117,97 C103,95 90,99 84,110 C80,124 89,137 103,140 C113,142 117,135 117,124 Z',
    labelAt: { x: 100, y: 118 },
  },
  {
    id: 'biceps',
    label: 'Biceps',
    color: '#FF5B8A',
    mirror: true,
    d: 'M62,134 C55,152 51,175 53,193 C61,200 74,197 76,186 C78,166 76,148 73,134 C69,130 65,130 62,134 Z',
    labelAt: { x: 60, y: 166 },
  },
  {
    id: 'forearms',
    label: 'Forearms',
    color: '#FFB85B',
    mirror: true,
    d: 'M53,201 C46,225 41,253 40,278 C47,284 59,282 61,271 C65,247 68,222 68,202 C63,198 56,198 53,201 Z',
    labelAt: { x: 48, y: 246 },
  },
  {
    id: 'abs',
    label: 'Abs',
    color: '#5B7CFF',
    mirror: true,
    d: 'M118,150 C107,151 104,157 105,167 C104,193 106,217 110,233 C114,239 118,239 118,233 Z',
    labelAt: { x: 120, y: 196 },
  },
  {
    id: 'obliques',
    label: 'Obliques',
    color: '#5BFFC8',
    mirror: true,
    d: 'M103,154 C96,164 94,186 97,208 C100,216 104,218 105,212 C102,190 102,168 103,154 Z',
    labelAt: { x: 96, y: 186 },
  },
  {
    id: 'quads',
    label: 'Quadriceps',
    color: '#FF5BC5',
    mirror: true,
    d: 'M114,272 C100,274 92,288 91,308 C90,334 95,360 100,378 C108,384 114,380 115,370 C117,340 117,304 114,272 Z',
    labelAt: { x: 102, y: 326 },
  },
  {
    id: 'adductors',
    label: 'Adductors',
    color: '#C8FF5B',
    mirror: true,
    d: 'M118,272 C113,290 112,320 113,346 C116,350 119,348 119,340 C120,310 120,288 118,272 Z',
    labelAt: { x: 120, y: 308 },
  },
  {
    id: 'calves',
    label: 'Calves',
    color: '#FF8A5B',
    mirror: true,
    d: 'M106,396 C99,412 98,446 101,478 C106,486 111,482 111,472 C112,442 111,414 110,396 Z',
    labelAt: { x: 100, y: 440 },
  },
];

export const BACK_MUSCLES = [
  {
    id: 'traps',
    label: 'Trapezius',
    color: '#B75BFF',
    mirror: true,
    d: 'M116,74 C104,78 90,86 80,94 C90,104 100,118 106,136 C110,148 114,152 117,150 C118,120 118,94 116,74 Z',
    labelAt: { x: 96, y: 106 },
  },
  {
    id: 'shoulders',
    label: 'Rear Delts',
    color: '#5BE7FF',
    mirror: true,
    d: 'M80,92 C64,98 51,112 51,128 C56,139 74,140 82,131 C86,117 86,102 84,94 Z',
    labelAt: { x: 56, y: 118 },
  },
  {
    id: 'lats',
    label: 'Lats',
    color: '#FF5B5B',
    mirror: true,
    d: 'M108,122 C96,128 88,144 87,163 C90,187 100,205 110,215 C116,217 118,211 118,201 C118,171 114,144 108,122 Z',
    labelAt: { x: 98, y: 172 },
  },
  {
    id: 'triceps',
    label: 'Triceps',
    color: '#FFB74B',
    mirror: true,
    d: 'M62,132 C55,151 51,173 53,193 C61,200 73,197 76,186 C78,164 76,146 73,132 C69,128 65,128 62,132 Z',
    labelAt: { x: 60, y: 164 },
  },
  {
    id: 'forearms',
    label: 'Forearms',
    color: '#FFB85B',
    mirror: true,
    d: 'M53,201 C46,225 41,253 40,278 C47,284 59,282 61,271 C65,247 68,222 68,202 C63,198 56,198 53,201 Z',
    labelAt: { x: 48, y: 246 },
  },
  {
    id: 'lowerback',
    label: 'Lower Back',
    color: '#5BFFC8',
    mirror: true,
    d: 'M116,182 C110,190 108,208 109,228 C112,238 117,240 118,232 C119,212 118,196 116,182 Z',
    labelAt: { x: 120, y: 214 },
  },
  {
    id: 'glutes',
    label: 'Glutes',
    color: '#FFB74D',
    mirror: true,
    d: 'M116,246 C104,246 94,257 92,273 C94,289 106,297 116,295 C119,293 119,287 119,279 Z',
    labelAt: { x: 102, y: 272 },
  },
  {
    id: 'hamstrings',
    label: 'Hamstrings',
    color: '#5BE7FF',
    mirror: true,
    d: 'M114,300 C102,302 94,316 93,336 C93,356 98,374 103,384 C110,388 115,384 115,374 C117,346 117,320 114,300 Z',
    labelAt: { x: 100, y: 344 },
  },
  {
    id: 'calves',
    label: 'Calves',
    color: '#FF8A5B',
    mirror: true,
    d: 'M108,398 C99,408 96,436 99,462 C104,472 111,470 112,458 C114,436 112,414 110,398 Z',
    labelAt: { x: 100, y: 436 },
  },
];

/** Content shown in the detail panel when a muscle is selected. */
export const MUSCLE_LIBRARY = {
  neck: {
    name: 'Neck',
    latin: 'Sternocleidomastoid / Levator scapulae',
    function: 'Rotates, flexes and stabilises the head. Often neglected, but key for posture and contact sports.',
    exercises: ['Neck Curl', 'Neck Extension', 'Lateral Neck Raise', 'Shrug Hold'],
    tip: 'Train with light loads and slow tempo — 2–3 sets of 15–20 reps is plenty.',
  },
  traps: {
    name: 'Trapezius',
    latin: 'Trapezius',
    function: 'Elevates, retracts and rotates the shoulder blades. Controls scapular movement in almost every upper-body lift.',
    exercises: ['Barbell Shrug', 'Face Pull', 'Farmer Carry', 'Upright Row'],
    tip: 'Pause one second at the top of shrugs — traps respond to time under tension, not momentum.',
  },
  shoulders: {
    name: 'Deltoids',
    latin: 'Deltoideus (anterior / lateral / posterior)',
    function: 'Raises the arm in every direction. Three heads means three separate movement patterns to train.',
    exercises: ['Overhead Press', 'Lateral Raise', 'Arnold Press', 'Rear Delt Fly'],
    tip: 'The side and rear heads build width — press-only shoulder training leaves them behind.',
  },
  chest: {
    name: 'Chest',
    latin: 'Pectoralis major / minor',
    function: 'Pushes and draws the arms across the body. Prime mover in all horizontal pressing.',
    exercises: ['Bench Press', 'Incline Dumbbell Press', 'Cable Fly', 'Weighted Dip'],
    tip: 'Keep shoulder blades pinned back and down — it protects the shoulder and loads the pecs harder.',
  },
  biceps: {
    name: 'Biceps',
    latin: 'Biceps brachii / Brachialis',
    function: 'Flexes the elbow and supinates the forearm. Assists in every pulling movement.',
    exercises: ['Barbell Curl', 'Incline Dumbbell Curl', 'Hammer Curl', 'Chin-Up'],
    tip: 'Do not swing. If the elbows drift forward, the front delts are doing the work.',
  },
  triceps: {
    name: 'Triceps',
    latin: 'Triceps brachii',
    function: 'Extends the elbow. Two thirds of upper-arm mass — the real size driver.',
    exercises: ['Close-Grip Bench', 'Skull Crusher', 'Rope Pushdown', 'Overhead Extension'],
    tip: 'Include at least one overhead movement to hit the long head through its full stretch.',
  },
  forearms: {
    name: 'Forearms',
    latin: 'Flexor / Extensor group',
    function: 'Controls the wrist and grip. Grip strength is the limiting factor in most heavy pulls.',
    exercises: ['Wrist Curl', 'Reverse Curl', 'Dead Hang', "Farmer's Walk"],
    tip: 'Train grip at the end of a session — fried forearms will cap your rows and deadlifts.',
  },
  chestBack: null,
  lats: {
    name: 'Latissimus Dorsi',
    latin: 'Latissimus dorsi',
    function: 'Pulls the arms down and back. The muscle that creates the V-taper.',
    exercises: ['Pull-Up', 'Lat Pulldown', 'Barbell Row', 'Single-Arm Dumbbell Row'],
    tip: 'Think about driving the elbows into your back pockets rather than pulling with the hands.',
  },
  lowerback: {
    name: 'Lower Back',
    latin: 'Erector spinae',
    function: 'Extends and stabilises the spine. Keeps you braced under every heavy load.',
    exercises: ['Deadlift', 'Back Extension', 'Good Morning', 'Romanian Deadlift'],
    tip: 'Build it slowly. This is the one area where ego lifting reliably ends a training block.',
  },
  abs: {
    name: 'Abdominals',
    latin: 'Rectus abdominis',
    function: 'Flexes the trunk and resists extension. The front wall of your bracing system.',
    exercises: ['Hanging Leg Raise', 'Cable Crunch', 'Ab Wheel', 'Plank'],
    tip: 'Load them like any other muscle — sets of 8–15 with resistance beat endless bodyweight reps.',
  },
  obliques: {
    name: 'Obliques',
    latin: 'External / internal oblique',
    function: 'Rotates and side-bends the trunk, and resists rotation under load.',
    exercises: ['Pallof Press', 'Russian Twist', 'Side Plank', 'Woodchopper'],
    tip: 'Anti-rotation work carries over to squats and presses better than twisting crunches.',
  },
  glutes: {
    name: 'Glutes',
    latin: 'Gluteus maximus / medius',
    function: 'Extends the hip and stabilises the pelvis. The strongest muscle in the body.',
    exercises: ['Hip Thrust', 'Bulgarian Split Squat', 'Romanian Deadlift', 'Cable Kickback'],
    tip: 'Full hip extension with a hard squeeze at the top beats adding more weight.',
  },
  quads: {
    name: 'Quadriceps',
    latin: 'Rectus femoris / Vastus group',
    function: 'Extends the knee. Drives every squat, lunge and sprint.',
    exercises: ['Back Squat', 'Front Squat', 'Leg Press', 'Leg Extension'],
    tip: 'Depth beats load. Hitting parallel or below recruits far more muscle than a heavy half-squat.',
  },
  hamstrings: {
    name: 'Hamstrings',
    latin: 'Biceps femoris / Semitendinosus',
    function: 'Flexes the knee and extends the hip. Critical for sprint speed and knee health.',
    exercises: ['Romanian Deadlift', 'Leg Curl', 'Nordic Curl', 'Good Morning'],
    tip: 'Train both functions — a hip hinge and a knee curl — in the same week.',
  },
  adductors: {
    name: 'Adductors',
    latin: 'Adductor magnus / longus',
    function: 'Draws the legs toward the midline and assists hip extension out of the bottom of a squat.',
    exercises: ['Sumo Deadlift', 'Cossack Squat', 'Adductor Machine', 'Wide-Stance Squat'],
    tip: 'Commonly the real cause of "tight hips" — stretch and strengthen, do not just stretch.',
  },
  calves: {
    name: 'Calves',
    latin: 'Gastrocnemius / Soleus',
    function: 'Plantar-flexes the ankle. Absorbs load on every step, jump and landing.',
    exercises: ['Standing Calf Raise', 'Seated Calf Raise', 'Jump Rope', 'Donkey Calf Raise'],
    tip: 'Bent-knee raises hit the soleus, straight-leg raises hit the gastroc. Do both.',
  },
};
