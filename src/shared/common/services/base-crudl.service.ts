export abstract class BaseCRUDLService {
    /**
     * The primary key field
     */
    primaryKeyField: string = 'id';

    /**
     * Create a new data entry
     *
     * @param data - Document data
     */
    abstract create(data: any): any;

    /**
     * Retrieve a data entry by id
     *
     * @param id - Document ID
     */
    abstract retrieve(id: any): any;


    /**
     * Retrieve a data entry by filter
     *
     * @param filter
     */
    abstract retrieveBy(filter: any): any;

    /**
     * Update a data entry by id
     *
     * @param id - Document ID
     * @param data - Data to be modified
     */
    abstract update(id: any, data: any): any;


    /**
     * Update a data entry by filter
     *
     * @param filter - Document filter
     * @param data - Data to be modified
     */
    abstract updateBy(filter: any, data: any): any;

    /**
     * Delete a data entry by id
     * @param id
     */
    abstract delete(id: any): any;

    /**
    * Delete a data entry by filter
     *
    * @param filter
    */
    abstract deleteBy(filter: any): any;

    /**
     * List all data entries
     *
     * @param filter - Filter to be applied
     * @returns List of data entries
     */
    abstract list(filter?: any): any;
}
