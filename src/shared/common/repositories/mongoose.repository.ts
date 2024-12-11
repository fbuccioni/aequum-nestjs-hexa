import { HydratedDocument, Model as MongooseModel } from 'mongoose';


export class MongooseRepository<Model> {
    protected model: MongooseModel<Model>;

    async delete(filter: any) {
        await this.model.deleteOne(filter).exec();
    }

    async deleteMany(filter: any) {
        await this.model.deleteMany(filter).exec();
    }

    async find(filter: any): Promise<Model[]> {
        return this.model.find(filter).exec();
    }

    async get(filter: any): Promise<Model> {
        return this.model.findOne(filter).exec();
    }

    async getById(id: any): Promise<Model> {
        return this.model.findById(id).exec();
    }

    async insert(data: any)  {
        const document: HydratedDocument<Model> = new this.model(data);
        await document.save();

        return document._id;
    }

    async update(filter: any, data: any) {
        await this.model.updateOne(filter, { $set: data }).exec();
    }
}
