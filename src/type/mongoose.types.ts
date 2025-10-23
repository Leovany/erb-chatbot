import { Document } from "mongoose";

// 通用的MongoDB文档类型
export type MongoDocument<T> = Document<unknown, {}, T> & T & { _id: unknown };
