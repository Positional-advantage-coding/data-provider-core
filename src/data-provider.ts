import { Observable } from 'rxjs';
import { Entity } from './entity';
import { EntityConverter } from "./converter";

export abstract class DataProvider {
    public abstract converterMap: Map<string, EntityConverter<any, any>>

    public abstract getEntity<T extends Entity<string>>(path: string): Observable<T | undefined>;

    public abstract listenToCollectionChanges<T extends Entity<string>>(path: string): Observable<T[]>;

    public abstract convertIntoEntity<T extends Entity<string>>(rawObject: any): T | undefined;
}