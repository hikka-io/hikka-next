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
    public async search(
        args: CompaniesSearchArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<CompaniesPaginationResponse> {
        return this.client.post<CompaniesPaginationResponse>(
            '/companies',
            args,
            {
                page,
                size,
            },
        );
    }
}
