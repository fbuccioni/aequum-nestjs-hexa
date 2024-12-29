import { AnyKeys, HydratedDocument, Model as MongooseModel, RootFilterQuery } from 'mongoose';


type AnyObject = { [ key: string ]: any };

export class MongooseRepository<SchemaModel> {
    protected model: MongooseModel<SchemaModel>;

    async delete(filter: RootFilterQuery<SchemaModel>) {
        await this.model.deleteOne(filter).exec();
    }

    async deleteMany(filter: RootFilterQuery<SchemaModel>) {
        await this.model.deleteMany(filter).exec();
    }

    async find(filter: RootFilterQuery<SchemaModel>): Promise<SchemaModel[]> {
        return this.model.find(filter).exec();
    }

    async getOne(filter: RootFilterQuery<SchemaModel>): Promise<SchemaModel> {
        return this.model.findOne(filter).exec();
    }

    async getOneById(id: any): Promise<SchemaModel> {
        return this.model.findById(id).exec();
    }

    async put(data: SchemaModel | AnyObject): Promise<SchemaModel>  {
        const document: HydratedDocument<SchemaModel> = new this.model(data);
        await document.save();

        return document.toJSON() as SchemaModel;
    }

    async putMany(data: any[]) {
        return Promise.all(data.map((item) => this.put(item)));
    }

    async update(filter: RootFilterQuery<SchemaModel>, data: AnyKeys<SchemaModel> & AnyObject) {
        await this.model.updateOne(filter, { $set: data }).exec();
    }
}
