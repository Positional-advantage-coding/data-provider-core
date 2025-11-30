import { Entity } from './entity';
import {IdGenerator} from "@positional_advantage_coder/id-generator";

export abstract class EntityConverter<ID = string, T extends Entity<ID> = Entity<ID>> {
    abstract toPlainObject(entity: T): object;
    abstract fromPlainObject(value: any): T | null;
    abstract createDraft(data: Omit<T, 'id' | 'typeKey'>): Omit<T, 'id'>;
}

export interface EntityConverterConfig {
    typeKey: string;
    converter: EntityConverter<any, Entity<any>>;
}