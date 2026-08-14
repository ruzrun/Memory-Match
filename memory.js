/* =========================================================
   MEMORY MATCH 🃏
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const MIN_PAIRS = 2;
const MAX_PAIRS = 25;

const CARD_SIZE_DESKTOP = 58;
const CARD_SIZE_MOBILE = 52;

const CARD_GAP = 7;

const FLIP_BACK_DELAY = 800;


/* =========================================================
   IMAGE LIST
========================================================= */

/*
    Put your images inside:

    images/image1.png
    images/image2.png
    ...

    You can add as many as you want.

    The game randomly chooses the number of images
    it needs for the current game.
*/

const cardImages = [

    "images/image1.png",
    "images/image2.png",
    "images/image3.png",
    "images/image4.png",
    "images/image5.png",
    "images/image6.png",
    "images/image7.png",
    "images/image8.png",
    "images/image9.png",
    "images/image10.png",
    "images/image11.png",
    "images/image12.png",
    "images/image13.png",
    "images/image14.png",
    "images/image15.png",
    "images/image16.png",
    "images/image17.png",
    "images/image18.png",
    "images/image19.png",
    "images/image20.png",
    "images/image21.png",
    "images/image22.png",
    "images/image23.png",
    "images/image24.png",
    "images/image25.png",
    "images/image26.png",
    "images/image27.png",
    "images/image28.png",
    "images/image29.png",
    "images/image30.png",
    "images/image31.png",
    "images/image32.png",
    "images/image33.png",
    "images/image34.png",
    "images/image35.png",
    "images/image36.png",
    "images/image37.png",
    "images/image38.png",
    "images/image39.png",
    "images/image40.png",
    "images/image41.png",
    "images/image42.png",
    "images/image43.png",
    "images/image44.png",
    "images/image45.png",
    "images/image46.png",
    "images/image47.png",
    "images/image48.png",
    "images/image49.png",
    "images/image50.png"

];


/* =========================================================
   DOM
========================================================= */

const gameBoard =
    document.getElementById("gameBoard");

const movesDisplay =
    document.getElementById("moves");

const pairsDisplay =
    document.getElementById("pairs");

const bestScoreDisplay =
    document.getElementById("bestScore");

const gameMessage =
    document.getElementById("gameMessage");

const restartButton =
    document.getElementById("restartButton");

const musicButton =
    document.getElementById("musicButton");


/* =========================================================
   GAME STATE
========================================================= */

let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let matchedPairs = 0;

let totalPairs = 0;

let bestScore =
    Number(
        localStorage.getItem(
            "memoryMatchBest"
        )
    ) || 0;


/* =========================================================
   UPDATE BEST SCORE
========================================================= */

bestScoreDisplay.textContent =
    bestScore;


/* =========================================================
   RANDOM NUMBER
========================================================= */

function randomNumber(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

    const result =
        [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];

    }

    return result;

}


/* =========================================================
   CHOOSE NUMBER OF PAIRS
========================================================= */

function choosePairCount() {

    /*
        Randomly choose between
        2 and 25 pairs.

        Smaller games are slightly
        more common so the player
        doesn't constantly get huge
        games.
    */

    const random =
        Math.random();

    if (random < 0.18) {
        return 2;
    }

    if (random < 0.32) {
        return randomNumber(3, 5);
    }

    if (random < 0.55) {
        return randomNumber(6, 10);
    }

    if (random < 0.78) {
        return randomNumber(11, 16);
    }

    if (random < 0.93) {
        return randomNumber(17, 21);
    }

    return randomNumber(22, 25);

}


/* =========================================================
   CREATE CARD DATA
========================================================= */

function createCardData() {

    totalPairs =
        Math.min(
            choosePairCount(),
            cardImages.length
        );

    const selectedImages =
        shuffle(cardImages)
            .slice(
                0,
                totalPairs
            );


    let data = [];


    selectedImages.forEach(
        (image, index) => {

            data.push({
                id: index,
                image: image
            });

            data.push({
                id: index,
                image: image
            });

        }
    );


    return shuffle(data);

}


/* =========================================================
   GENERATE RANDOM CONNECTED SHAPE
========================================================= */

function generateShape(count) {

    /*
        We create a collection of
        connected coordinates.

        The shape begins from the centre
        and grows randomly.

        This means the result can become:

             XX
           XXXXX
         XXXXXXXX
           XXXXX

        instead of a normal rectangle.
    */


    const cells =
        new Set();

    const positions = [];


    const startX = 0;
    const startY = 0;


    cells.add(
        `${startX},${startY}`
    );


    positions.push({
        x: startX,
        y: startY
    });


    const directions = [

        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }

    ];


    let safety = 0;


    while (
        positions.length < count &&
        safety < 10000
    ) {

        safety++;


        /*
            Pick an existing cell.
        */

        const base =
            positions[
                randomNumber(
                    0,
                    positions.length - 1
                )
            ];


        /*
            Random direction.
        */

        const direction =
            directions[
                randomNumber(
                    0,
                    directions.length - 1
                )
            ];


        const newX =
            base.x + direction.x;

        const newY =
            base.y + direction.y;


        const key =
            `${newX},${newY}`;


        if (
            !cells.has(key)
        ) {

            cells.add(key);

            positions.push({
                x: newX,
                y: newY
            });

        }

    }


    /*
        Shuffle the generated
        positions so the card order
        isn't predictable.
    */

    return shuffle(positions);

}


/* =========================================================
   NORMALISE SHAPE
========================================================= */

function normaliseShape(positions) {

    if (!positions.length) {
        return positions;
    }


    const minX =
        Math.min(
            ...positions.map(
                position => position.x
            )
        );


    const minY =
        Math.min(
            ...positions.map(
                position => position.y
            )
        );


    return positions.map(
        position => ({

            x:
                position.x - minX,

            y:
                position.y - minY

        })
    );

}


/* =========================================================
   GET CARD SIZE
========================================================= */

function getCardSize() {

    return window.innerWidth <= 600
        ? CARD_SIZE_MOBILE
        : CARD_SIZE_DESKTOP;

}


/* =========================================================
   CREATE BOARD
========================================================= */

function createBoard() {

    gameBoard.innerHTML = "";

    cards = [];

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    moves = 0;
    matchedPairs = 0;


    movesDisplay.textContent =
        "0";

    pairsDisplay.textContent =
        `0 / ${totalPairs}`;


    gameBoard.classList.remove(
        "game-complete"
    );


    /*
        Generate random shape.
    */

    let shape =
        generateShape(
            totalPairs * 2
        );


    shape =
        normaliseShape(
            shape
        );


    /*
        Find dimensions.
    */

    const maxX =
        Math.max(
            ...shape.map(
                cell => cell.x
            )
        );


    const maxY =
        Math.max(
            ...shape.map(
                cell => cell.y
            )
        );


    const minCellSize =
        getCardSize();


    const gap =
        CARD_GAP;


    /*
        Calculate board dimensions.
    */

    let boardWidth =
        (maxX + 1) *
        (minCellSize + gap);


    let boardHeight =
        (maxY + 1) *
        (minCellSize + gap);


    /*
        Make sure the board has
        enough space for the shape.
    */

    const maxBoardWidth =
        Math.min(
            gameBoard.parentElement
                ? gameBoard.parentElement
                    .clientWidth
                : 650,
            650
        );


    const maxBoardHeight =
        window.innerWidth <= 600
            ? 480
            : 600;


    /*
        Scale down large shapes.
    */

    let scale = 1;


    if (
        boardWidth >
        maxBoardWidth
    ) {

        scale =
            Math.min(
                scale,
                maxBoardWidth /
                boardWidth
            );

    }


    if (
        boardHeight >
        maxBoardHeight
    ) {

        scale =
            Math.min(
                scale,
                maxBoardHeight /
                boardHeight
            );

    }


    /*
        Do not let cards become
        impossibly tiny.
    */

    scale =
        Math.max(
            scale,
            0.48
        );


    const cardSize =
        minCellSize *
        scale;


    const actualGap =
        gap *
        scale;


    boardWidth =
        (maxX + 1) *
        (cardSize + actualGap);


    boardHeight =
        (maxY + 1) *
        (cardSize + actualGap);


    /*
        Give the board its size.
    */

    gameBoard.style.width =
        `${Math.min(
            boardWidth,
            maxBoardWidth
        )}px`;


    gameBoard.style.height =
        `${Math.min(
            boardHeight,
            maxBoardHeight
        )}px`;


    /*
        Centre the shape.
    */

    gameBoard.style.position =
        "relative";


    /*
        Shuffle card data separately.
    */

    const shuffledCards =
        createCardData();


    /*
        Create cards.
    */

    shuffledCards.forEach(
        (cardData, index) => {

            const position =
                shape[index];


            const card =
                createCard(
                    cardData,
                    index,
                    position,
                    cardSize,
                    actualGap
                );


            gameBoard.appendChild(
                card
            );


            cards.push(card);

        }
    );


    gameMessage.textContent =
        `Find ${totalPairs} matching pairs 💕`;

}


/* =========================================================
   CREATE INDIVIDUAL CARD
========================================================= */

function createCard(
    cardData,
    index,
    position,
    cardSize,
    gap
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "memory-card";


    card.dataset.id =
        cardData.id;


    card.dataset.index =
        index;


    /*
        Position.
    */

    card.style.width =
        `${cardSize}px`;

    card.style.height =
        `${cardSize}px`;


    card.style.left =
        `${position.x *
            (cardSize + gap)
        }px`;


    card.style.top =
        `${position.y *
            (cardSize + gap)
        }px`;


    /*
        Inner.
    */

    const inner =
        document.createElement(
            "div"
        );


    inner.className =
        "card-inner";


    /*
        Back.
    */

    const back =
        document.createElement(
            "div"
        );


    back.className =
        "card-back";


    back.textContent =
        "?";


    /*
        Front.
    */

    const front =
        document.createElement(
            "div"
        );


    front.className =
        "card-front";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        cardData.image;


    image.alt =
        "Memory card";


    image.draggable =
        false;


    front.appendChild(
        image
    );


    inner.appendChild(
        back
    );

    inner.appendChild(
        front
    );


    card.appendChild(
        inner
    );


    /*
        Click event.
    */

    card.addEventListener(
        "click",
        () => {

            handleCardClick(
                card
            );

        }
    );


    return card;

}


/* =========================================================
   CARD CLICK
========================================================= */

function handleCardClick(card) {

    if (
        lockBoard
    ) {
        return;
    }


    if (
        card === firstCard
    ) {
        return;
    }


    if (
        card.classList.contains(
            "matched"
        )
    ) {
        return;
    }


    if (
        card.classList.contains(
            "flipped"
        )
    ) {
        return;
    }


    flipCard(card);


    if (
        !firstCard
    ) {

        firstCard =
            card;

        gameMessage.textContent =
            "Find its match ✨";

        return;

    }


    secondCard =
        card;


    moves++;

    movesDisplay.textContent =
        moves;


    checkForMatch();

}


/* =========================================================
   FLIP CARD
========================================================= */

function flipCard(card) {

    card.classList.add(
        "flipped"
    );

}


/* =========================================================
   CHECK MATCH
========================================================= */

function checkForMatch() {

    if (
        !firstCard ||
        !secondCard
    ) {
        return;
    }


    const isMatch =
        firstCard.dataset.id ===
        secondCard.dataset.id;


    if (
        isMatch
    ) {

        handleMatch();

    } else {

        handleMismatch();

    }

}


/* =========================================================
   MATCH
========================================================= */

function handleMatch() {

    lockBoard =
        true;


    firstCard.classList.add(
        "matched"
    );

    secondCard.classList.add(
        "matched"
    );


    matchedPairs++;


    pairsDisplay.textContent =
        `${matchedPairs} / ${totalPairs}`;


    gameMessage.textContent =
        "Match found! 💕";


    setTimeout(
        () => {

            resetTurn();

            if (
                matchedPairs >=
                totalPairs
            ) {

                winGame();

            }

        },
        350
    );

}


/* =========================================================
   MISMATCH
========================================================= */

function handleMismatch() {

    lockBoard =
        true;


    firstCard.classList.add(
        "wrong"
    );

    secondCard.classList.add(
        "wrong"
    );


    gameMessage.textContent =
        "Not quite... try again 💫";


    setTimeout(
        () => {

            firstCard.classList.remove(
                "flipped",
                "wrong"
            );

            secondCard.classList.remove(
                "flipped",
                "wrong"
            );


            resetTurn();

        },
        FLIP_BACK_DELAY
    );

}


/* =========================================================
   RESET TURN
========================================================= */

function resetTurn() {

    firstCard =
        null;

    secondCard =
        null;

    lockBoard =
        false;

}


/* =========================================================
   WIN GAME
========================================================= */

function winGame() {

    lockBoard =
        true;


    gameBoard.classList.add(
        "game-complete"
    );


    gameMessage.textContent =
        `You found all ${totalPairs} pairs! 🎉`;


    /*
        Lower moves = better score.

        Score is calculated from
        the number of pairs and moves.
    */

    const score =
        Math.max(
            1,
            Math.round(
                (
                    totalPairs * 1000
                ) /
                Math.max(
                    moves,
                    totalPairs
                )
            )
        );


    if (
        score > bestScore
    ) {

        bestScore =
            score;


        localStorage.setItem(
            "memoryMatchBest",
            bestScore
        );


        bestScoreDisplay.textContent =
            bestScore;


        gameMessage.textContent =
            `NEW BEST! ${score} points! 🏆`;

    }

}


/* =========================================================
   NEW GAME
========================================================= */

function newGame() {

    createBoard();

}


/* =========================================================
   RESTART BUTTON
========================================================= */

restartButton.addEventListener(
    "click",
    () => {

        newGame();

    }
);


/* =========================================================
   RESIZE
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    /*
                        Rebuild the current
                        game layout after resize.

                        We do NOT do this while
                        the player is halfway
                        through selecting cards.
                    */

                    if (
                        !lockBoard &&
                        cards.length > 0
                    ) {

                        rebuildPositions();

                    }

                },
                150
            );

    }
);


/* =========================================================
   REBUILD POSITIONS
========================================================= */

function rebuildPositions() {

    /*
        Get the current cards.

        Keep their existing order
        and matched state.
    */

    if (
        !cards.length
    ) {
        return;
    }


    const positions =
        normaliseShape(
            generateShape(
                cards.length
            )
        );


    const maxX =
        Math.max(
            ...positions.map(
                p => p.x
            )
        );


    const maxY =
        Math.max(
            ...positions.map(
                p => p.y
            )
        );


    const baseSize =
        getCardSize();


    const gap =
        CARD_GAP;


    let boardWidth =
        (maxX + 1) *
        (baseSize + gap);


    let boardHeight =
        (maxY + 1) *
        (baseSize + gap);


    const maxBoardWidth =
        Math.min(
            gameBoard.parentElement
                ? gameBoard.parentElement
                    .clientWidth
                : 650,
            650
        );


    const maxBoardHeight =
        window.innerWidth <= 600
            ? 480
            : 600;


    let scale = 1;


    if (
        boardWidth >
        maxBoardWidth
    ) {

        scale =
            Math.min(
                scale,
                maxBoardWidth /
                boardWidth
            );

    }


    if (
        boardHeight >
        maxBoardHeight
    ) {

        scale =
            Math.min(
                scale,
                maxBoardHeight /
                boardHeight
            );

    }


    scale =
        Math.max(
            scale,
            0.48
        );


    const cardSize =
        baseSize *
        scale;


    const actualGap =
        gap *
        scale;


    boardWidth =
        (maxX + 1) *
        (cardSize + actualGap);


    boardHeight =
        (maxY + 1) *
        (cardSize + actualGap);


    gameBoard.style.width =
        `${Math.min(
            boardWidth,
            maxBoardWidth
        )}px`;


    gameBoard.style.height =
        `${Math.min(
            boardHeight,
            maxBoardHeight
        )}px`;


    cards.forEach(
        (card, index) => {

            const position =
                positions[index];


            card.style.width =
                `${cardSize}px`;


            card.style.height =
                `${cardSize}px`;


            card.style.left =
                `${position.x *
                    (cardSize + actualGap)
                }px`;


            card.style.top =
                `${position.y *
                    (cardSize + actualGap)
                }px`;

        }
    );

}


/* =========================================================
   MUSIC
========================================================= */

/*
    If you already have your music file,
    put it here:

    music.mp3
*/

const backgroundMusic =
    new Audio(
        "music.mp3"
    );


backgroundMusic.loop =
    true;

backgroundMusic.volume =
    0.35;


let musicEnabled =
    true;


if (musicButton) {

    musicButton.addEventListener(
        "click",
        () => {

            musicEnabled =
                !musicEnabled;


            if (
                musicEnabled
            ) {

                backgroundMusic
                    .play()
                    .catch(
                        () => {}
                    );


                musicButton.textContent =
                    "🎵 Music On";

            } else {

                backgroundMusic.pause();


                musicButton.textContent =
                    "🔇 Music Off";

            }

        }
    );

}


/*
    Browser autoplay protection.

    Start music after the player's
    first interaction.
*/

document.addEventListener(
    "click",
    () => {

        if (
            musicEnabled &&
            backgroundMusic.paused
        ) {

            backgroundMusic
                .play()
                .catch(
                    () => {}
                );

        }

    },
    {
        once: true
    }
);


/* =========================================================
   START GAME
========================================================= */

newGame();
