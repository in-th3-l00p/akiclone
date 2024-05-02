import {z} from "zod";
import {NextResponse} from "next/server";
import openai from "@/utils/openai";

const bodySchema = z.object({
    questions: z.array(z.string().max(100)),
    answers: z.array(z.enum([ "yes", "no", "probably", "probably not", "don't know" ])),
});

export async function POST(req: Request) {
    let body;
    try {
        body = bodySchema.safeParse(await req.json());
    } catch (e) {
        return NextResponse.json({
            error: "Invalid request body",
        }, { status: 400 });
    }
    if (body.error)
        return NextResponse.json({
            error: body.error,
        }, { status: 400 });
    if (body.data.answers.length !== body.data.questions.length)
        return NextResponse.json({
            error: "Number of questions and answers must match",
        }, { status: 400 });

    let mergedMessages = [{
        role: "system",
        content: "You are Akinator, a web genie that can guess any character you are thinking of. You can answer 'yes', 'no', 'probably', 'probably not', or 'don't know' to the questions I ask you. Here are the rules of the game if it is helpful: " +
            "Before beginning the questionnaire, the players must think of a character, object, or animal.[2] Akinator initiates a series of questions, with \"Yes,\" \"No,\" \"Probably,\" \"Probably not,\" and \"Don't know\" as possible answers, to narrow down the potential item.[3][4] If the answer is narrowed down to a single likely option before 25 questions are asked, the program will automatically ask whether the item it chose is correct. If it is guessed wrong a few times in a row, the game will prompt the user to input the item's name to expand its database of choices. Lets start, ask a question! " +
            "Make sure you answer in a JSON object, where your question will be stored in the \"question\" key. " +
            "If you have a guess, place it inside the \"guess\" key, else leave it null."
    }];
    for (let i = 0; i < body.data.questions.length; i++) {
        mergedMessages.push({
            role: "assistant",
            content: JSON.stringify({question: body.data.questions[i], guess: null}),
        });
        mergedMessages.push({
            role: "user",
            content: body.data.answers[i],
        });
    }

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
        // @ts-ignore
        messages: mergedMessages,
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content!));
}