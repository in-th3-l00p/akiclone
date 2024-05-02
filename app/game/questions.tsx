"use client";

import React, {useEffect, useState} from "react";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Spinner} from "@nextui-org/spinner";
import {Button} from "@nextui-org/button";
import {Divider} from "@nextui-org/divider";

type Answer = "yes" | "no" | "probably" | "probably not" | "don't know";

export default function Questions({ guess, setGuess }: {
    guess: string | null;
    setGuess: React.Dispatch<React.SetStateAction<string | null>>;
}) {
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [potentialGuess, setPotentialGuess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (questions.length > answers.length || loading)
            return;
        setLoading(true);
        fetch("/api/question", {
            method: "POST",
            body: JSON.stringify({
                questions, answers
            }),
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-cache"
        })
            .then(res => res.json())
            .then(data => {
                if (data.guess) {
                    setQuestions(questions => [...questions, `Is your character ${data.guess}?`]);
                    setPotentialGuess(data.guess);
                } else
                    setQuestions(questions => [...questions, data.question]);
            })
            .finally(() => setLoading(false));
    }, [answers]);

    if (loading)
        return (
            <div className="w-full h-full flex-grow flex justify-center items-center">
                <Card className={"max-w-[600px] w-full"}>
                    <CardBody className={"flex flex-col items-center justify-center gap-8"}>
                        <h1 className="text-2xl font-bold">Loading</h1>
                        <Spinner />
                    </CardBody>
                </Card>
            </div>
        );
    if (potentialGuess)
        return (
            <div className="w-full h-full flex-grow flex justify-center items-center">
                <Card className={"max-w-[600px] w-full"}>
                    <CardHeader className={"flex justify-center"}>
                        <h1 className="text-2xl font-bold">Is this your character?</h1>
                    </CardHeader>
                    <CardBody className={"flex flex-col items-center justify-center gap-8"}>
                        <h1 className="text-2xl font-bold">{potentialGuess}</h1>
                    </CardBody>
                    <CardFooter className={"flex flex-col gap-4"}>
                        <Button
                            onClick={() => setGuess(potentialGuess)}
                            className={"w-full"}
                        >
                            {`Yes`}
                        </Button>
                        <Button
                            onClick={() => {
                                setPotentialGuess(null);
                                setAnswers([...answers, "no"])
                            }}
                            className={"w-full"}
                        >
                            {`No`}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    return (
        <div className="w-full h-full flex-grow flex justify-center items-center">
            <Card className={"max-w-[600px] w-full"}>
                <CardHeader className={"flex justify-center"}>
                    <h1 className="text-2xl font-bold">Question #{questions.length}</h1>
                </CardHeader>
                <Divider />
                <CardBody>
                    <p>{questions[questions.length - 1]}</p>
                </CardBody>
                <Divider />
                <CardFooter className={"flex flex-col gap-4"}>
                    <Button
                        onClick={() => setAnswers([...answers, "yes"])}
                        className={"w-full"}
                    >
                        {`Yes`}
                    </Button>
                    <Button
                        onClick={() => setAnswers([...answers, "no"])}
                        className={"w-full"}
                    >
                        {`No`}
                    </Button>
                    <Button
                        onClick={() => setAnswers([...answers, "probably"])}
                        className={"w-full"}
                    >
                        {`Probably`}
                    </Button>
                    <Button
                        onClick={() => setAnswers([...answers, "probably not"])}
                        className={"w-full"}
                    >
                        {`Probably not`}
                    </Button>
                    <Button
                        onClick={() => setAnswers([...answers, "don't know"])}
                        className={"w-full"}
                    >
                        {`Don't know`}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}