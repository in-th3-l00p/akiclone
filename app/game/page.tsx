"use client";

import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Divider} from "@nextui-org/divider";
import {Button} from "@nextui-org/button";
import {useEffect, useState} from "react";
import Questions from "@/app/game/questions";

enum GameState {
    START,
    QUESTION,
    END
}

export default function Game() {
    const [state, setState] = useState<GameState>(GameState.START);
    const [guess, setGuess] = useState<string | null>(null);

    useEffect(() => {
        if (guess)
            setState(GameState.END);
    }, [guess]);

    if (state === GameState.END)
        return (
            <div className="w-full h-full flex-grow flex justify-center items-center">
                <Card className={"max-w-[600px] w-full"}>
                    <CardHeader className={"flex justify-center"}>
                        <h1 className="text-2xl font-bold">The character you thought of is</h1>
                    </CardHeader>
                    <CardBody className={"flex justify-center"}>
                        <p className="text-xl font-bold text-center">{guess}</p>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <Button
                            className={"mx-auto"}
                            onClick={() => {
                                setGuess(null);
                                setState(GameState.START);
                            }}
                        >
                            Restart
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    if (state === GameState.QUESTION)
        return (
            <Questions
                guess={guess}
                setGuess={setGuess}
            />
        );
    return (
        <div className="w-full h-full flex-grow flex justify-center items-center">
            <Card className={"max-w-[600px] w-full"}>
                <CardHeader>
                    <h1 className="text-2xl font-bold">Think of a character</h1>
                </CardHeader>
                <Divider />
                <CardBody className={"flex flex-col gap-4"}>
                    <p>{`Before beginning the questionnaire, the players must think of a character, object, or animal. Akinator initiates a series of questions, with "Yes," "No," "Probably," "Probably not," and "Don't know" as possible answers, to narrow down the potential item. If the answer is narrowed down to a single likely option before 25 questions are asked, the program will automatically ask whether the item it chose is correct. If it is guessed wrong a few times in a row, the game will prompt the user to input the item's name to expand its database of choices.`}</p>
                        <p>Therefore, think of your character and press the {`"Next"`} button.</p>

                </CardBody>
                <Divider />
                <CardFooter>
                    <Button
                        className={"mx-auto"}
                        onClick={() => setState(GameState.QUESTION)}
                    >
                        Next
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}