import { resetTest } from "helpers/resetTest";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setTime,
    setType,
    setWordList,
    timerSet,
} from "store/actions";
import { State } from "store/reducer";
import "stylesheets/Header.scss";

export interface Options {
    time: number[];
    type: string[];
}

interface AnimationProps {
    top: number;
    left: number;
    theme: string;
}

export const options: any = {
    time: [30, 60, 300],
};

export default function Header() {
    const {
        preferences: { timeLimit, theme, type },
        time: { timerId },
    } = useSelector((state: State) => state);
    const [animationProps, setAnimationProps] =
        useState<AnimationProps | null>();
    const dispatch = useDispatch();

    useEffect(() => { 
        const type = localStorage.getItem("type") || "words";
        const time = parseInt(localStorage.getItem("time") || "60", 10);
        import(`wordlists/${type}.json`).then((words) =>
            dispatch(setWordList(words.default))
        );
        dispatch(timerSet(time));
        dispatch(setType(type));
        dispatch(setTime(time));
    }, [dispatch]);

    // Set Time
    useEffect(() => {
        if (timeLimit !== 0) {
            document.querySelector(".time")?.childNodes.forEach((el) => {
                if (el instanceof HTMLButtonElement)
                    el.classList.remove("selected");
            });
            document
                .querySelector(`button[value="${timeLimit}"]`)
                ?.classList.add("selected");
            dispatch(setTime(timeLimit));
            localStorage.setItem("time", `${timeLimit}`);
            resetTest();
        }
    }, [dispatch, timeLimit]);

    // Set Type
    useEffect(() => {
        if (type !== "") {
            document.querySelector(".type")?.childNodes.forEach((el) => {
                if (el instanceof HTMLButtonElement)
                    el.classList.remove("selected");
            });
            document
                .querySelector(`button[value="${type}"]`)
                ?.classList.add("selected");
            dispatch(setType(type));
            localStorage.setItem("type", type);
            resetTest();
        }
    }, [dispatch, type]);

    const handleOptions = ({ target, clientX, clientY }: React.MouseEvent) => {
        if (target instanceof HTMLButtonElement && target.dataset.option) {
            if (target.value === theme || +target.value === timeLimit) {
                target.blur();
                return;
            }
            switch (target.dataset.option) {
                case "time":
                    dispatch(setTime(+target.value));
                    break;
                case "type":
                    dispatch(setType(target.value));
                    break;
            }
            target.blur();
        }
    };

    return (
        <header className={timerId ? "hidden" : undefined}>
            <a href="." className="brand">
                Typing-Test
            </a>
            <div className="buttons">
                {Object.entries(options).map(([option, choices]:any) => (
                    <div key={option} className={option}>
                        {option}:
                        {choices.map((choice: string) => (
                            <button
                                className="mini"
                                key={choice}
                                data-option={option}
                                value={choice}
                                onClick={(e) => handleOptions(e)}>
                                {choice}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </header>
    );
}
