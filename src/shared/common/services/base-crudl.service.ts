export abstract class BaseCRUDLService {
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
     * Update a data entry by id
     *
     * @param id - Document ID
     * @param data - Data to be modified
     */
    abstract update(id: any, data: any): any;

    /**
     * Delete a data entry by id
     * @param id
     */
    abstract delete(id: any): any;

    /**
     * List all data entries
     *
     * @returns List of data entries
     */
    abstract list(filter?: any): any;
}
