import { Question } from "./question.model";

export class Survey {
    id: number;
    name: string;
    description: string;
    source: number;
    sourceName: string;
    questions: Question[];
}
