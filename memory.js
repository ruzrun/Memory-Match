/* =========================================================
   MEMORY MATCH 🃏
   Fixed 12 × 12 Board
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const MIN_PAIRS = 2;
const MAX_PAIRS = 25;

const BOARD_SIZE = 12;

const MOBILE_BOARD_HEIGHT = 460;
const DESKTOP_BOARD_HEIGHT = 560;

const MOBILE_PADDING = 8;
const DESKTOP_PADDING = 12;

const CARD_GAP = 5;

const FLIP_BACK_DELAY = 800;


/* =========================================================
   CARD IMAGES
========================================================= */

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


/* =========================================================
   BEST SCORE
========================================================= */

let bestScore =
    Number(
        localStorage.getItem(
            "memoryMatchBest"
        )
    ) || 0;


if (bestScoreDisplay) {

    bestScoreDisplay.textContent =
        bestScore;

}


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
   CHOOSE PAIRS
========================================================= */

function choosePairCount() {

    /*
        More small games,
        fewer huge games.

        Maximum is always 25 pairs.
    */

    const random =
        Math.random();


    if (random < 0.15) {

        return randomNumber(
            2,
            4
        );

    }


    if (random < 0.32) {

        return randomNumber(
            5,
            8
        );

    }


    if (random < 0.55) {

        return randomNumber(
            9,
            13
        );

    }


    if (random < 0.75) {

        return randomNumber(
            14,
            18
        );

    }


    if (random < 0.92) {

        return randomNumber(
            19,
            22
        );

    }


    return randomNumber(
        23,
        25
    );

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
        shuffle(
            cardImages
        ).slice(
            0,
            totalPairs
        );


    const result = [];


    selectedImages.forEach(
        (image, index) => {

            result.push({

                id: index,

                image: image

            });


            result.push({

                id: index,

                image: image

            });

        }
    );


    return shuffle(
        result
    );

}


/* =========================================================
   FIXED BOARD
========================================================= */

function setupBoard() {

    const mobile =
        window.innerWidth <= 600;


    const height =
        mobile
            ? MOBILE_BOARD_HEIGHT
            : DESKTOP_BOARD_HEIGHT;


    /*
        The board ALWAYS has the same
        physical size for the device.
    */

    gameBoard.style.width =
        "100%";


    gameBoard.style.height =
        `${height}px`;


    gameBoard.style.position =
        "relative";


    gameBoard.style.margin =
        "0 auto";


    gameBoard.style.overflow =
        "hidden";


    gameBoard.style.boxSizing =
        "border-box";

}


/* =========================================================
   GENERATE COMPACT RANDOM PATTERN
========================================================= */

function generatePattern(count) {

    /*
        We use the fixed 12 × 12 board.

        The centre of the board is preferred.

        Cards closer to the centre have a
        higher chance of being selected.

        Randomness is still added, so every
        game has a different pattern.
    */


    const candidates = [];


    const centre =
        (BOARD_SIZE - 1) / 2;


    for (
        let y = 0;
        y < BOARD_SIZE;
        y++
    ) {

        for (
            let x = 0;
            x < BOARD_SIZE;
            x++
        ) {

            const dx =
                x - centre;

            const dy =
                y - centre;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            /*
                Lower score = more likely.

                Random component means the
                shape changes every game.
            */

            const score =
                distance +
                Math.random() * 3.8;


            candidates.push({

                x: x,

                y: y,

                score: score

            });

        }

    }


    /*
        Sort by compactness.
    */

    candidates.sort(
        (a, b) =>
            a.score -
            b.score
    );


    /*
        Take the required number.
    */

    let selected =
        candidates.slice(
            0,
            count
        );


    /*
        Shuffle the selected positions
        so card/image order doesn't follow
        the pattern.
    */

    selected =
        shuffle(
            selected
        );


    return selected;

}


/* =========================================================
   GET CARD SIZE
========================================================= */

function getCardSize() {

    const boardWidth =
        gameBoard.clientWidth;


    const mobile =
        window.innerWidth <= 600;


    const padding =
        mobile
            ? MOBILE_PADDING
            : DESKTOP_PADDING;


    const gap =
        mobile
            ? 4
            : CARD_GAP;


    /*
        12 logical columns.

        This means even a 50-card game
        has a guaranteed safe position.
    */

    const available =
        boardWidth -
        padding * 2;


    const size =
        (
            available -
            (
                BOARD_SIZE - 1
            ) * gap
        ) /
        BOARD_SIZE;


    return {

        size: Math.floor(
            size
        ),

        gap: gap,

        padding: padding

    };

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


    if (movesDisplay) {

        movesDisplay.textContent =
            "0";

    }


    if (pairsDisplay) {

        pairsDisplay.textContent =
            `0 / ${totalPairs}`;

    }


    gameBoard.classList.remove(
        "game-complete"
    );


    /*
        Fixed board.
    */

    setupBoard();


    /*
        Get card positions.
    */

    const pattern =
        generatePattern(
            totalPairs * 2
        );


    /*
        Get physical card size.
    */

    const dimensions =
        getCardSize();


    const cardSize =
        dimensions.size;

    const gap =
        dimensions.gap;

    const padding =
        dimensions.padding;


    /*
        Create shuffled card data.
    */

    const shuffledCards =
        createCardData();


    /*
        Generate the pattern again if
        card count was changed by
        createCardData().
    */

    const finalPattern =
        generatePattern(
            shuffledCards.length
        );


    /*
        Create cards.
    */

    shuffledCards.forEach(
        (cardData, index) => {

            const position =
                finalPattern[index];


            const card =
                createCard(
                    cardData,
                    index,
                    position,
                    cardSize,
                    gap,
                    padding
                );


            gameBoard.appendChild(
                card
            );


            cards.push(
                card
            );

        }
    );


    /*
        Message.
    */

    if (gameMessage) {

        gameMessage.textContent =
            `Find ${totalPairs} matching pairs 💕`;

    }

}


/* =========================================================
   CREATE CARD
========================================================= */

function createCard(
    cardData,
    index,
    position,
    cardSize,
    gap,
    padding
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
        Physical size.
    */

    card.style.width =
        `${cardSize}px`;


    card.style.height =
        `${cardSize}px`;


    /*
        Position inside fixed board.
    */

    card.style.left =
        `${padding +
            position.x *
            (
                cardSize +
                gap
            )
        }px`;


    card.style.top =
        `${padding +
            position.y *
            (
                cardSize +
                gap
            )
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
        Click.
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

    if (lockBoard) {
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


    flipCard(
        card
    );


    if (!firstCard) {

        firstCard =
            card;


        if (gameMessage) {

            gameMessage.textContent =
                "Find its match ✨";

        }


        return;

    }


    secondCard =
        card;


    moves++;


    if (movesDisplay) {

        movesDisplay.textContent =
            moves;

    }


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


    const match =
        firstCard.dataset.id ===
        secondCard.dataset.id;


    if (match) {

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


    if (pairsDisplay) {

        pairsDisplay.textContent =
            `${matchedPairs} / ${totalPairs}`;

    }


    if (gameMessage) {

        gameMessage.textContent =
            "Match found! 💕";

    }


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
   WRONG MATCH
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


    if (gameMessage) {

        gameMessage.textContent =
            "Not quite... try again 💫";

    }


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
   WIN
========================================================= */

function winGame() {

    lockBoard =
        true;


    gameBoard.classList.add(
        "game-complete"
    );


    /*
        Score based on efficiency.

        Fewer moves = higher score.
    */

    const score =
        Math.max(
            1,
            Math.round(
                (
                    totalPairs *
                    1000
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


        if (bestScoreDisplay) {

            bestScoreDisplay.textContent =
                bestScore;

        }


        if (gameMessage) {

            gameMessage.textContent =
                `NEW BEST! ${score} points! 🏆`;

        }

    } else {

        if (gameMessage) {

            gameMessage.textContent =
                `You found all ${totalPairs} pairs! 🎉`;

        }

    }

}


/* =========================================================
   NEW GAME
========================================================= */

function newGame() {

    /*
        Choose the number of pairs
        BEFORE creating the board.
    */

    totalPairs =
        Math.min(
            choosePairCount(),
            cardImages.length
        );


    createBoard();

}


/* =========================================================
   RESTART
========================================================= */

if (restartButton) {

    restartButton.addEventListener(
        "click",
        () => {

            newGame();

        }
    );

}


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

                    repositionCards();

                },
                150
            );

    }
);


/* =========================================================
   REPOSITION EXISTING CARDS
========================================================= */

function repositionCards() {

    if (
        !cards.length
    ) {
        return;
    }


    /*
        IMPORTANT:

        We don't create a new random
        pattern here.

        We only resize the existing
        cards so the current game
        doesn't suddenly change.
    */


    const mobile =
        window.innerWidth <= 600;


    const padding =
        mobile
            ? MOBILE_PADDING
            : DESKTOP_PADDING;


    const gap =
        mobile
            ? 4
            : CARD_GAP;


    const dimensions =
        getCardSize();


    const cardSize =
        dimensions.size;


    cards.forEach(
        card => {

            const x =
                Number(
                    card.dataset.gridX
                );


            const y =
                Number(
                    card.dataset.gridY
                );


            /*
                Older cards may not have
                grid coordinates.

                In that case don't move them.
            */

            if (
                Number.isNaN(x) ||
                Number.isNaN(y)
            ) {

                return;

            }


            card.style.width =
                `${cardSize}px`;


            card.style.height =
                `${cardSize}px`;


            card.style.left =
                `${padding +
                    x *
                    (
                        cardSize +
                        gap
                    )
                }px`;


            card.style.top =
                `${padding +
                    y *
                    (
                        cardSize +
                        gap
                    )
                }px`;

        }
    );

}


/* =========================================================
   MUSIC
========================================================= */

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


            if (musicEnabled) {

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


/* =========================================================
   START MUSIC AFTER FIRST TOUCH/CLICK
========================================================= */

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
