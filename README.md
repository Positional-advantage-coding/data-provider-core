# @positional-advantage-libs/data-provider-core



```markdown
Npm package - https://www.npmjs.com/package/data-provider-core
```

A framework-agnostic TypeScript library for creating a backend-agnostic data access layer. It provides a set of core contracts that allow you to completely decouple your application's business logic from its data source.

> The primary goal of this library is to remove direct dependency of your project on data provider of you choice.

## Core Concepts

The architecture is built on three primary abstractions:

1.  **`Entity`**: A base interface that describes any data model in your system (e.g., a `Todo` or a `User`).
2.  **`EntityConverter`**: A "translator" that knows how to convert data between a plain object (from the backend) and an instance of your entity class, and vice-versa.
3.  **`DataProvider`**: The main contract that defines the operations that can be performed on your data (`getEntity`, `listenToCollectionChanges`, etc.). You implement this contract to connect to a specific data source.

## Dependencies
- rxjs
- typescript

## Installation

```bash
npm install data-provider-core rxjs
```

## API Reference
This library exports three primary abstractions that form the core of the pattern.


## Entity
```TypeScript
Entity<ID> - A fundamental interface that all of your domain models must implement.
    
export interface Entity<ID> {
  id: ID;
  typeKey: string;
}

- id: The unique identifier for the entity.
- typeKey: A static string discriminator (e.g., 'TODO') used by the system to dynamically find the correct EntityConverter for a given object.
    
## Example:
class Todo implements Entity<string> {
    public static typeKey = 'TODO';
    public typeKey: string;
    public id!: string;
    public name!: string;

    constructor({id, name}: Omit<Todo, 'typeKey'>) {
        this.typeKey = Todo.typeKey;
        this.id = id
        this.name = name;
    }
}

```

## EntityConverter
```TypeScript
EntityConverter<ID, T> - An abstract class responsible for the serialization and deserialization of your models.
    You must provide a concrete implementation for each entity.
    
abstract class EntityConverter<ID = string, T extends Entity<ID> = Entity<ID>> {
    abstract toPlainObject(entity: T): object;
    abstract fromPlainObject(value: any): T | null;
    abstract validateCreation(value: any): boolean;
}

interface EntityConverterConfig {
    typeKey: string;
    converter: EntityConverter<any, Entity<any>>;
}

- toPlainObject(entity) - Converts a class instance into a plain object suitable for storage.
- fromPlainObject(value) - Converts a raw object from the data source into a new class instance.
- validateCreation(value) - A gatekeeper method that validates a raw object before conversion.
    
## Example:
    class TodoConverter implements EntityConverter<string, Todo> {
        public toPlainObject(todo: Todo): Todo {
            return {id: todo.id, typeKey: Todo.typeKey, name: todo.name};
        }

        public fromPlainObject(value: Todo): Todo | null {
            if (!this.validateCreation(value)) {
                console.error(`Error during creation validation for TODO, value:`, value);
                return null;
            }

            return new Todo(value);
        }

        public validateCreation(value: Todo): boolean {
            return !!(value.id && value.typeKey === Todo.typeKey);
        }
    }

    export const TodoConverterConfig: EntityConverterConfig = {
        typeKey: Todo.typeKey,
        converter: new TodoConverter()
    }

```

## DataProvider
```TypeScript
DataProvider - The central abstract class that serves as the contract for your data access layer. This is the class you will implement to connect to a specific data source.
    abstract class DataProvider {
        public abstract getEntity<T extends Entity<string>>(path: string): Observable<T | undefined>;
        public abstract listenToCollectionChanges<T extends Entity<string>>(path: string): Observable<T[]>;
        public abstract convertIntoEntity<T extends Entity<string>>(rawObject: any): T | undefined;
        protected abstract converterMap: Map<string, EntityConverter<any, any>>
    }
    
    - getEntity(path) - Get entity once, returns an Observable with the item
    - listenToCollectionChanges(path) - Listens to collection of entities
    - convertIntoEntity(rawObject) - Converts simple objects in domain level Entites
    - converterMap - map of converters, for example { 'TODO': TodoConverter }

    Example:
      @Injectable({
        providedIn: 'root'
      })
      class FirestoreDataProviderService implements DataProvider {
        constructor(
                private firestore: Firestore,
                @Inject(ENTITY_CONVERTER_MAP_TOKEN) private converterMap: Map<string, EntityConverter<any, any>>
        ) {}
  
        public getEntity<T extends Entity<string>>(path: string): Observable<T | undefined> {
          const docRef = doc(this.firestore, path);
          return docData(docRef, { idField: 'id' }).pipe(
                  map((plainObject: any) => this.convertIntoEntity(plainObject))
          );
        }
  
        public listenToCollectionChanges<T extends Entity<string>>(path: string): Observable<T[]> {
          const collectionRef: CollectionReference = collection(this.firestore, path);
          const q: Query = query(collectionRef);
  
          return collectionData(q, { idField: 'id' }).pipe(
                  map((plainObjects: DocumentData[]) => {
                    return plainObjects
                            .map(obj => this.convertIntoEntity<T>(obj))
                            .filter(Boolean) as T[];
                  })
          );
        }
  
        public convertIntoEntity<T extends Entity<string>>(rawObject: any): T | undefined {
          if (!rawObject || !rawObject.typeKey) {
            return undefined;
          }
  
          const converter = this.converterMap.get(rawObject.typeKey);
  
          if (converter) {
            return converter.fromPlainObject(rawObject) as T;
          }
  
          console.warn(`No converter registered for typeKey: "${rawObject.typeKey}"`);
          return undefined;
        }

```