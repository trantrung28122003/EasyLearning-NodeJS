import moogoose, { Schema } from "mongoose" 


export interface IRole extends Document {
    name: string;
    description: string;
    changedBy?: string;
    isDeleted: boolean;
};

const roleSchema: Schema<IRole> = new Schema({
        name:{type: String, required: true},
        description:{type: String, default: ''},
        changedBy:{type: String},
        isDeleted:{type: Boolean, default: false},
    }, 
    { 
        timestamps: true 
    }
);

export default moogoose.model<IRole>('Role', roleSchema);
