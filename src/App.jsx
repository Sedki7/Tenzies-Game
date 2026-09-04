import { useRef, useState } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import YroliSound from "./assets/Yrouli1.mp3";
import YroliFullSound from "./assets/Yrouli.mp3";
export default function App() {
    const audioRef = useRef(new Audio(YroliSound));
    const fullAudioRef = useRef(new Audio(YroliFullSound));

    const [dice, setDice] = useState(() => generateAllNewDice());
    const { width, height } = useWindowSize();
    const gameWon =
        dice.every((die) => die.isHeld) &&
        dice.every((die) => die.value === dice[0].value);
    if (gameWon) {
        const song = audioRef.current;
        console.log("sdasd");
        song.pause();
        const fullSong = fullAudioRef.current;
        fullSong.currentTime = 0;
        fullSong.play();
    }
    function generateAllNewDice() {
        return new Array(10).fill(0).map(() => ({
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid(),
        }));
    }

    function rollDice() {
        const song = audioRef.current;
        song.currentTime = 0;
        song.play();
        if (!gameWon) {
            setDice((oldDice) =>
                oldDice.map((die) =>
                    die.isHeld
                        ? die
                        : { ...die, value: Math.ceil(Math.random() * 6) },
                ),
            );
        } else {
            setDice(generateAllNewDice());
        }
    }

    function hold(id) {
        setDice((oldDice) =>
            oldDice.map((die) =>
                die.id === id ? { ...die, isHeld: !die.isHeld } : die,
            ),
        );
    }

    const diceElements = dice.map((dieObj) => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ));

    return (
        <main>
            {gameWon && <Confetti width={width} height={height} />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">
                Roll until all dice are the same. Click each die to freeze it at
                its current value between rolls.
            </p>
            <div className="dice-container">{diceElements}</div>
            <button className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    );
}
