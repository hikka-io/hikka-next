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
        page: number = 1,
        size: number = 15,
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
