import { Answer } from "./answer.model";

export class Question {
    id: number;
    name: string;
    description: string;
    selectedAnswer: number;
    answers: Answer[];
}
