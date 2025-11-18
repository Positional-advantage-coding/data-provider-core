import { Entity } from './entity';

export abstract class EntityConverter<ID = string, T extends Entity<ID> = Entity<ID>> {
    abstract toPlainObject(entity: T): object;
    abstract fromPlainObject(value: any): T | null;
    abstract validateCreation(value: any): boolean;
}

export interface EntityConverterConfig {
    typeKey: string;
    converter: EntityConverter<any, Entity<any>>;
}