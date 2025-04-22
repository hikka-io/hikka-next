import { PaginationResponse } from './common';

/**
 * Company response
 */
export interface CompanyResponse {
    name_ua: string | null;
    name_en: string | null;
    description: string | null;
    slug: string;
    type: string;
}

/**
 * Companies search arguments
 */
export interface CompaniesSearchArgs {
    query?: string;
    type?: string;
}

/**
 * Companies list response
 */
export interface CompaniesPaginationResponse {
    list: CompanyResponse[];
    pagination: PaginationResponse;
}
