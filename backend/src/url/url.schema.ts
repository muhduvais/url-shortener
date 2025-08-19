import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ timestamps: true })
export class Url extends Document {
    @Prop({ required: true })
    originalUrl: string;

    @Prop()
    shortCode: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;
}

export const urlSchema = SchemaFactory.createForClass(Url);