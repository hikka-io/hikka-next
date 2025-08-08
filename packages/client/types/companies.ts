import { PaginationResponse } from './common';

/**
 * Company response
 */
export interface CompanyResponse {
    name_ua: string | null;
    name_en: string | null;
    name: string;
    description: string | null;
    slug: string;
    type: CompanyTypeEnum;
}
/**
 * Company type enum
 */
export enum CompanyTypeEnum {
    PRODUCER = 'producer',
    STUDIO = 'studio',
}

/**
 * Companies search arguments
 */
export interface CompaniesSearchArgs {
    query?: string;
    type?: CompanyTypeEnum;
}

/**
 * Companies list response
 */
export interface CompaniesPaginationResponse {
    list: CompanyResponse[];
    pagination: PaginationResponse;
}
