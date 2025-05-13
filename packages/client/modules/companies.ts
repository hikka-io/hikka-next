import { DEFAULT_PAGINATION } from '../constants';
import { PaginationArgs } from '../types';
import {
    CompaniesPaginationResponse,
    CompaniesSearchArgs,
} from '../types/companies';
import { BaseModule } from './base';

/**
 * Module for handling companies
 */
export class CompaniesModule extends BaseModule {
    /**
     * Search for companies
     */
    public async searchCompanies(
        args: CompaniesSearchArgs,
        { page, size }: PaginationArgs,
    ): Promise<CompaniesPaginationResponse> {
        return this.client.post<CompaniesPaginationResponse>(
            '/companies',
            args,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
            },
        );
    }
}
