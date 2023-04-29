const check = () => {
    const a1 = document.querySelector(".name input");
    const a2 = document.querySelector(".nb input");
    if (/^[a-zA-Z]+$/.test(a1.value) === false) {
        a1.value = "";
    }

    if (/^[0-9]+$/.test(a2.value) === false) {
        a2.value = "";
    } else {
        if (parseInt(a2.value) > 10) {

            a2.value = "10";
        } else {
            if (parseInt(a2.value) < 4) {
                a2.value = "4";
            }
        }
    }

};

const selectEmoji = (element) => {
    const emojiElements = document.querySelectorAll(".emoji");
    emojiElements.forEach((emojiElement) => {
        emojiElement.classList.remove("selected");
    });

    element.classList.add("selected");

    const selectedEmoji = element.textContent;
    return selectedEmoji;
};

const replay = () => {
    document.querySelector(".replay button").addEventListener("click", () => {
        squares = [];
        show();
    });
};

const emojies = document.querySelectorAll(".emoji");
for (let index = 0; index < emojies.length; index++) {
    emojies[index].addEventListener("click", (e) => {
        document.querySelector(".hidden-emoji").innerText = selectEmoji(e.target);
    });
}

const table = document.querySelector(".game table");
const popup = document.querySelector(".popup");
const status = document.querySelector(".status");
const reset = document.getElementById("reset");
const game = document.querySelector(".game");

let squares = [];
let whoPlayNow = document.querySelector(".hidden-emoji").innerHTML;
let gameEnds = false;

const createRow = (number, len, k) => {
    const row = document.createElement("tr");
    for (let j = 0; j < number; j++) {
        const square = createSquare(len, k);
        row.appendChild(square);
        k++;
    }
    return row;
};

const createSquare = (len, k) => {
    const square = document.createElement("td");
    square.classList.add("square");
    square.setAttribute("data-index", k);
    square.style.height = `${len}px`;
    square.style.width = `${len}px`;
    square.addEventListener("click", handleClick);
    return square;
};

const handleClick = (e) => {
    const square = e.target;
    console.log("ss",square)
    const index = square.dataset.index;
    replay();

    if (squares[index] !== "" || gameEnds) {
        return;
    }

    squares[index] = whoPlayNow;
    square.innerText = whoPlayNow;

    const number = Math.sqrt(squares.length);
    const winMsgForPlayer = `🎉 Congratulations! ${document.querySelector(".name input").value} 🎉, you win`;
    const loseMsgForPlayer = "Game Over 😥, the Computer wins";
    const drawMsgForPlayer = "Draw 😐";
    const playerEmoji = document.querySelector(".hidden-emoji").innerHTML
        ? document.querySelector(".hidden-emoji").innerHTML
        : "😊";
    const computerEmoji = "💻";

    if (verifIfSomeoneWin(squares, number)) {
        setTimeout(() => {
            game.classList.add("display-none");
            popup.classList.remove("display-none");
        }, 1000);
        gameEnds = true;
        status.innerText = whoPlayNow === playerEmoji ? winMsgForPlayer : loseMsgForPlayer;
        return;
    }

    if (IsThatADraw()) {
        setTimeout(() => {
            game.classList.add("display-none");
            popup.classList.remove("display-none");
        }, 1000);
        gameEnds = true;
        status.innerText = drawMsgForPlayer;
        return;
    }

    whoPlayNow = whoPlayNow === playerEmoji ? computerEmoji : playerEmoji;
    autoGame(number);
};

const createTable = (number, len) => {
    let k = 0;
    const table = document.createElement("table");
    for (let i = 0; i < number; i++) {
        const row = createRow(number, len / number, k);
        table.appendChild(row);
        k += number;
    }
    return table;
};

const fillTable = () => {
    const len = 500;
    const number = document.querySelector(".nb input").value === "" ? 4 : parseInt(document.querySelector(".nb input").value);
    const table = createTable(number, len);
    table.style.setProperty("--number", number);
    whoPlayNow = document.querySelector(".hidden-emoji").innerHTML ? document.querySelector(".hidden-emoji").innerHTML : "😊";
    gameEnds = false;
    squares = new Array(number * number).fill("");
    document.querySelector("table").innerHTML = "";
    document.querySelector("table").appendChild(table);
};


const verifIfSomeoneWin = (squares, number) => {
    const lines = [];

    for (let i = 0; i < number; i++) {
        let row = [];
        let column = [];
        for (let j = 0; j < number; j++) {
            row.push(i * number + j);
            column.push(j * number + i);
        }
        lines.push(row);
        lines.push(column);
    }

    let diagoPrinc = [];
    let diagoSecond = [];
    for (let i = 0; i < number; i++) {
        diagoPrinc.push(i * number + i);
        diagoSecond.push(i * number + (number - i - 1));
    }
    lines.push(diagoPrinc);
    lines.push(diagoSecond);

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let symbol = squares[line[0]];
        if (symbol && line.every((index) => squares[index] === symbol)) {
            return true;
        }
    }

    return false;
};

const IsThatADraw = () => {
    return squares.every((square) => square !== "");
};

const autoGame = (number) => {
    const winMsgForPlayer =
        "🎉 Congratulations! " +
        document.querySelector(".name input").value +
        "🎉, you win";
    const loseMsgForPlayer = "Game Over 😥, the Computer wins";
    const drawMsgForPlayer = "Draw 😐";
    const playerEmoji = document.querySelector(".hidden-emoji").innerHTML
        ? document.querySelector(".hidden-emoji").innerHTML
        : "😊";
    const computerEmoji = "💻";

    const emptysquares = squares
        .map((val, index) => (val === "" ? index : -1))
        .filter((index) => index !== -1);

    const makeMove = (squareIndex, whoPlayNow) => {
        squares[squareIndex] = whoPlayNow;
        const square = table.querySelector(`[data-index="${squareIndex}"]`);
        square.innerText = whoPlayNow;
    };

    const handleWinOrDraw = (statusMessage) => {
        setTimeout(() => {
            game.classList.add("display-none");
            popup.classList.remove("display-none");
        }, 1000);
        gameEnds = true;
        status.innerText = statusMessage;
    };

    const checkForWinOrDraw = () => {
        if (verifIfSomeoneWin(squares, number)) {
            const statusMessage =
                whoPlayNow === playerEmoji ? winMsgForPlayer : loseMsgForPlayer;
            handleWinOrDraw(statusMessage);
            return true;
        }
        if (IsThatADraw()) {
            handleWinOrDraw(drawMsgForPlayer);
            return true;
        }
        return false;
    };

    const switchPlayers = () => {
        whoPlayNow = whoPlayNow === playerEmoji ? computerEmoji : playerEmoji;
    };

    for (let i = 0; i < emptysquares.length; i++) {
        const squareIndex = emptysquares[i];
        const testsquares = [...squares];
        testsquares[squareIndex] = whoPlayNow;
        if (verifIfSomeoneWin(testsquares, number)) {
            makeMove(squareIndex, whoPlayNow);
            if (checkForWinOrDraw()) {
                return;
            }
            switchPlayers();
            return;
        }
    }

    const otherPlayer = whoPlayNow === playerEmoji ? computerEmoji : playerEmoji;
    for (let i = 0; i < emptysquares.length; i++) {
        const squareIndex = emptysquares[i];
        const testsquares = [...squares];
        testsquares[squareIndex] = otherPlayer;
        if (verifIfSomeoneWin(testsquares, number)) {
            makeMove(squareIndex, whoPlayNow);
            if (checkForWinOrDraw()) {
                return;
            }
            switchPlayers();
            return;
        }
    }

    const randomIndex = Math.floor(Math.random() * emptysquares.length);
    const squareIndex = emptysquares[randomIndex];
    makeMove(squareIndex, whoPlayNow);
    if (checkForWinOrDraw()) {
        return;
    }
    switchPlayers();
};

const show = () => {
    let div = document.querySelector(".div");
    let game = document.querySelector(".game");
    let popup = document.querySelector(".popup");

    div.style.display = "none";
    game.classList.remove("display-none");
    popup.classList.add("display-none");
    fillTable();
};
