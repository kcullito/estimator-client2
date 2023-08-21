import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomResponse } from '../_models/custom-response.model';
import { Answer } from '../_models/survey/answer.model';
import { Question } from '../_models/survey/question.model';
import { SurveySource } from '../_models/survey/survey-source.model';
import { Survey } from '../_models/survey/survey.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

    surveyLink: string = `${environment.apiUrl}/api/survey`;
    questionLink: string = `${environment.apiUrl}/api/question`;
    answerLink: string = `${environment.apiUrl}/api/answer`;
    sourceLink: string = `${environment.apiUrl}/api/source`;

    constructor(private http: HttpClient) { }

    /*************************
     *      Survey Calls     *
     *************************/

    getSurveys(): Observable<any> {
        return this.http.get<CustomResponse>(`${this.surveyLink}/get`);
    }

    getSurvey(id: number) {
        return this.http.get<CustomResponse>(`${this.surveyLink}/get/${id}`);
    }

    saveSurvey(survey: Survey) {
        return this.http.post<CustomResponse>(`${this.surveyLink}/save`, survey);
    }

    deleteSurvey(id: number) {
        return this.http.get<CustomResponse>(`${this.surveyLink}/delete/${id}`);
    }

    updateSurvey(survey: Survey) {
        return this.http.post<CustomResponse>(`${this.surveyLink}/update`, survey);
    }


    /*************************
     *     Question Calls    *
     *************************/

    getQuestions(): Observable<any> {
        return this.http.get<CustomResponse>(`${this.surveyLink}/question/get`);
    }

    getQuestion(id: number) {
        return this.http.get<CustomResponse>(`${this.surveyLink}/question/get/${id}`);
    }

    saveQuestion(question: Question) {
        return this.http.post<CustomResponse>(`${this.surveyLink}/question/save`, question);
    }

    deleteQuestion(id: number) {
        return this.http.get<CustomResponse>(`${this.surveyLink}/question/delete/${id}`);
    }

    updateQuestion(question: Question) {
        return this.http.post<CustomResponse>(`${this.surveyLink}/question/update`, question);
    }


    /*************************
     *      Answer Calls     *
     *************************/

    getAnswers(): Observable<any> {
        return this.http.get<CustomResponse>(`${this.surveyLink}/answer/get`);
    }

    getAnswer(id: number) {
        return this.http.get<CustomResponse>(`${this.surveyLink}/answer/get/${id}`);
    }

    saveAnswer(answer: Answer) {
        return this.http.post<CustomResponse>(`${this.surveyLink}/answer/save`, answer);
    }

    deleteAnswer(id: number) {
        return this.http.get<CustomResponse>(`${this.surveyLink}/answer/delete/${id}`);
    }

    updateAnswer(answer: Answer) {
        return this.http.post<CustomResponse>(`${this.surveyLink}/answer/update`, answer);
    }


    /*************************
     *      Source Calls     *
     *************************/

    getSurveySources(): Observable<any> {
        return this.http.get<CustomResponse>(`${this.surveyLink}/source/get`);
    }

    getSurveySource(id: number) {
        return this.http.get<CustomResponse>(`${this.surveyLink}/source/get/${id}`);
    }

    saveSurveySource(source: SurveySource) {
        return this.http.post<CustomResponse>(`${this.surveyLink}/source/save`, source);
    }

    deleteSurveySource(id: number) {
        return this.http.get<CustomResponse>(`${this.surveyLink}/source/delete/${id}`);
    }

    updateSurveySource(source: SurveySource) {
        return this.http.post<CustomResponse>(`${this.surveyLink}/source/update`, source);
    }


}
