import { Observable } from 'rxjs';
import { Entity } from './entity';
import { EntityConverter } from "./converter";
import {IdGenerator} from "@positional_advantage_coder/id-generator";

export abstract class DataProvider {
    public abstract idGenerator: IdGenerator;

    public abstract converterMap: Map<string, EntityConverter<any, any>>;

    public abstract getEntity<T extends Entity<string>>(path: string): Observable<T | undefined>;

    public abstract createEntity<T extends Entity<string>>(path: string, draftEntity: Omit<T, 'id'>): Observable<T | undefined>;

    public abstract listenToCollectionChanges<T extends Entity<string>>(path: string): Observable<T[]>;

    public abstract convertIntoEntity<T extends Entity<string>>(rawObject: any): T | undefined;
}