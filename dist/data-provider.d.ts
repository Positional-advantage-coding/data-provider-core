import { Observable } from 'rxjs';
import { Entity } from './entity';
export declare abstract class DataProvider {
    abstract getEntity<T extends Entity<string>>(path: string): Observable<T | undefined>;
    abstract listenToCollectionChanges<T extends Entity<string>>(path: string): Observable<T[]>;
    abstract convertIntoEntity<T extends Entity<string>>(rawObject: any): T | undefined;
}
