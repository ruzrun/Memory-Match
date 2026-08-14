/* =========================================================
   MEMORY MATCH 🃏
   Emoji + Image Edition
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

const MOBILE_GAP = 4;
const DESKTOP_GAP = 6;

const FLIP_BACK_DELAY = 800;


/* =========================================================
   EMOJI CARDS
========================================================= */

const cardEmojis = [

    "🐶",
    "🐱",
    "🐼",
    "🦊",
    "🐸",
    "🐵",
    "🦄",
    "🐰",
    "🐨",
    "🐯",
    "🦁",
    "🐻",
    "🐷",
    "🐙",
    "🦋",
    "🌸",
    "⭐",
    "🌙",
    "🍓",
    "🍉",
    "🍕",
    "🍔",
    "🍩",
    "🎸",
    "🎮",
    "💌",
    "❤️",
    "💎",
    "🌈",
    "☀️",
    "🌻",
    "🍀",
    "🍒",
    "🍪",
    "🎀",
    "🎁",
    "🚀",
    "🌍",
    "⚽",
    "🏀",
    "🎧",
    "🎨",
    "📚",
    "☕",
    "🍰",
    "🧸",
    "🐣",
    "🐝",
    "🌺",
    "✨"

];


/* =========================================================
   IMAGE CARDS
========================================================= */

/*
    Put your images inside:

    images/image1.png
    images/image2.png
    images/image3.png

    etc.

    If you don't have image cards yet,
    simply leave this list empty.
*/

const cardImages = [

    "images/image1.png",
   /*
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
    "images/image25.png"*/

];


/* =========================================================
   DOM ELEMENTS
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
   CHOOSE NUMBER OF PAIRS
========================================================= */

function choosePairCount() {

    const random =
        Math.random();


    /*
        Smaller games are more common.
        Very large games are still possible.
    */

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
        MAX_PAIRS
    );

}


/* =========================================================
   CREATE AVAILABLE CARD TYPES
========================================================= */

function createAvailableCards() {

    const available = [];


    /*
        Add emojis.
    */

    cardEmojis.forEach(
        (emoji, index) => {

            available.push({

                type: "emoji",

                value: emoji,

                sourceIndex: index

            });

        }
    );


    /*
        Add images.
    */

    cardImages.forEach(
        (image, index) => {

            available.push({

                type: "image",

                value: image,

                sourceIndex: index

            });

        }
    );


    return available;

}


/* =========================================================
   CREATE CARD DATA
========================================================= */

function createCardData() {

    const availableCards =
        createAvailableCards();


    /*
        Make sure we never request
        more unique cards than we have.
    */

    totalPairs =
        Math.min(
            choosePairCount(),
            availableCards.length,
            MAX_PAIRS
        );


    /*
        Randomly select unique cards.
    */

    const selectedCards =
        shuffle(
            availableCards
        ).slice(
            0,
            totalPairs
        );


    const result = [];


    /*
        Create two copies of every card.
    */

    selectedCards.forEach(
        (card, index) => {

            result.push({

                id: index,

                type: card.type,

                value: card.value

            });


            result.push({

                id: index,

                type: card.type,

                value: card.value

            });

        }
    );


    /*
        Shuffle the complete deck.
    */

    return shuffle(
        result
    );

}


/* =========================================================
   SETUP FIXED BOARD
========================================================= */

function setupBoard() {

    const isMobile =
        window.innerWidth <= 600;


    const height =
        isMobile
            ? MOBILE_BOARD_HEIGHT
            : DESKTOP_BOARD_HEIGHT;


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
   GENERATE RANDOM COMPACT PATTERN
========================================================= */

function generatePattern(count) {

    /*
        The board is always 12 × 12.

        We don't resize the board according
        to the number of cards.

        Instead, we select positions close
        to the centre.

        This keeps large games compact.
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
                Add randomness.

                A small random value means
                every game has a different shape.
            */

            const score =
                distance +
                Math.random() * 3.5;


            candidates.push({

                x: x,

                y: y,

                score: score

            });

        }

    }


    /*
        Sort from centre outward.
    */

    candidates.sort(
        (a, b) =>
            a.score -
            b.score
    );


    /*
        Select the required number.
    */

    const selected =
        candidates.slice(
            0,
            count
        );


    /*
        Shuffle positions.

        This prevents the card deck order
        from determining the visual pattern.
    */

    return shuffle(
        selected
    );

}


/* =========================================================
   GET CARD DIMENSIONS
========================================================= */

function getCardDimensions() {

    const isMobile =
        window.innerWidth <= 600;


    const boardWidth =
        gameBoard.clientWidth;


    const padding =
        isMobile
            ? MOBILE_PADDING
            : DESKTOP_PADDING;


    const gap =
        isMobile
            ? MOBILE_GAP
            : DESKTOP_GAP;


    const availableWidth =
        boardWidth -
        padding * 2;


    /*
        12 columns.

        Every card has a guaranteed
        position within the board.
    */

    const cardSize =
        (
            availableWidth -
            (
                BOARD_SIZE - 1
            ) * gap
        ) /
        BOARD_SIZE;


    return {

        size:
            Math.floor(
                cardSize
            ),

        gap:
            gap,

        padding:
            padding

    };

}


/* =========================================================
   CREATE BOARD
========================================================= */

function createBoard() {

    gameBoard.innerHTML =
        "";


    cards = [];


    firstCard =
        null;


    secondCard =
        null;


    lockBoard =
        false;


    moves =
        0;


    matchedPairs =
        0;


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
        Create deck.

        IMPORTANT:
        createCardData() determines
        the number of pairs.
    */

    const deck =
        createCardData();


    /*
        Generate enough random positions.
    */

    const pattern =
        generatePattern(
            deck.length
        );


    /*
        Calculate card size.
    */

    const dimensions =
        getCardDimensions();


    /*
        Create every card.
    */

    deck.forEach(
        (cardData, index) => {

            const position =
                pattern[index];


            const card =
                createCard(
                    cardData,
                    index,
                    position,
                    dimensions.size,
                    dimensions.gap,
                    dimensions.padding
                );


            gameBoard.appendChild(
                card
            );


            cards.push(
                card
            );

        }
    );


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


    /*
        Matching ID.
    */

    card.dataset.id =
        cardData.id;


    card.dataset.index =
        index;


    /*
        Remember logical position.

        This allows the card to remain
        in the same place when the screen
        is resized.
    */

    card.dataset.gridX =
        position.x;


    card.dataset.gridY =
        position.y;


    /*
        Size.
    */

    card.style.width =
        `${cardSize}px`;


    card.style.height =
        `${cardSize}px`;


    /*
        Position.
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
        INNER
    */

    const inner =
        document.createElement(
            "div"
        );


    inner.className =
        "card-inner";


    /*
        BACK
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
        FRONT
    */

    const front =
        document.createElement(
            "div"
        );


    front.className =
        "card-front";


    /*
        IMAGE CARD
    */

    if (
        cardData.type ===
        "image"
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            cardData.value;


        image.alt =
            "Memory card";


        image.draggable =
            false;


        /*
            If image fails to load,
            show a cute fallback.
        */

        image.onerror =
            () => {

                image.style.display =
                    "none";


                front.textContent =
                    "🖼️";

            };


        front.appendChild(
            image
        );

    }


    /*
        EMOJI CARD
    */

    else {

        const emoji =
            document.createElement(
                "span"
            );


        emoji.className =
            "card-emoji";


        emoji.textContent =
            cardData.value;


        front.appendChild(
            emoji
        );

    }


    /*
        Build card.
    */

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


    /*
        Flip selected card.
    */

    flipCard(
        card
    );


    /*
        First card.
    */

    if (
        !firstCard
    ) {

        firstCard =
            card;


        if (gameMessage) {

            gameMessage.textContent =
                "Find its match ✨";

        }


        return;

    }


    /*
        Second card.
    */

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


    const isMatch =
        firstCard.dataset.id ===
        secondCard.dataset.id;


    if (isMatch) {

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
   WIN GAME
========================================================= */

function winGame() {

    lockBoard =
        true;


    gameBoard.classList.add(
        "game-complete"
    );


    /*
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
   START NEW GAME
========================================================= */

function newGame() {

    createBoard();

}


/* =========================================================
   RESTART BUTTON
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
   REPOSITION CARDS
========================================================= */

function repositionCards() {

    if (
        !cards.length
    ) {
        return;
    }


    const dimensions =
        getCardDimensions();


    const cardSize =
        dimensions.size;


    const gap =
        dimensions.gap;


    const padding =
        dimensions.padding;


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


/* =========================================================
   MUSIC BUTTON
========================================================= */

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


/* =========================================================
   AUTOPLAY AFTER FIRST INTERACTION
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
   START
========================================================= */

newGame();
