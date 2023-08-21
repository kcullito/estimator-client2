/**
 * @author  Misty Mountain Apps LLC
 * @version 1.0
 * @since   7/24/2023
 */

import { Category } from "./category.model";
import { Company } from "./company.model";
import { CostType } from "./cost-type.model";
import { Customer } from "./customer.model";
import { EstimateDetail } from "./estimate-detail.model";
import { EstimateStatus } from "./estimate-status.model";
import { EstimateType } from "./estimate-type.model";
import { Estimate } from "./estimate.model";
import { FileDetail } from "./file-detail.model";
import { RecordType } from "./record-type.model";
import { Role } from "./role.model";
import { Answer } from "./survey/answer.model";
import { Question } from "./survey/question.model";
import { SurveySource } from "./survey/survey-source.model";
import { Survey } from "./survey/survey.model";
import { User } from "./user.model";

export class CustomResponse {

    timeStamp:          Date | undefined;
    statusCode:         number | undefined;
    status:             string | undefined;
    reason:             string | undefined;
    message:            string | undefined;
    developerMessage:   string | undefined;
    token:              string | undefined;
    tokenExpiration:    Date   | undefined;
    data: { 
        user?               :   User,
        users?              :   User[],
        costType?           :   CostType,
        costTypes?          :   CostType[],
        recordType          :   RecordType,
        recordTypes?        :   RecordType[],
        category?           :   Category,
        categories?         :   Category[],
        estimateType?       :   EstimateType,
        estimateTypes?      :   EstimateType[],
        customer?           :   Customer,
        customers?          :   Customer[],
        salesTax?           :   number;
        estimate?           :   Estimate,
        estimates?          :   Estimate[],
        estimateDetail?     :   EstimateDetail,
        estimateDetails?     :   EstimateDetail[],
        estimateStatus?     :   EstimateStatus,
        estimateStatuses?   :   EstimateStatus[],
        company?            :   Company,
        companies?          :   Company[],
        files?              :   string[],
        fileDetail?         :   FileDetail,
        fileDetails?        :   FileDetail[],
        success?            :   boolean,
        logos?              :   string[],
        banners?            :   string[],
        role?               :   Role,
        roles?              :   Role[],
        survey?             :   Survey,
        surveys?            :   Survey[],
        question?           :   Question,
        questions?          :   Question[],
        answer?             :   Answer,
        answers?            :   Answer[],
        source?             :   SurveySource,
        sources?            :   SurveySource[]
        
    } | undefined;

}
