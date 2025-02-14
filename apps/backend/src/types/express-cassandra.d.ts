declare module 'express-cassandra' {
    import { ClientOptions, types } from 'cassandra-driver';

    export interface ExpressCassandraOptions {
        clientOptions: ClientOptions;
        ormOptions?: {
            debug?: boolean;
            defaultReplicationStrategy?: object;
            migration?: string;
            createKeyspace?: boolean;
        };
    }

    export function createClient(options: ExpressCassandraOptions): ScyllaClient;

    export interface ScyllaClient extends Client {
        loadSchema(modelName: string, schema: any): any;
        instance: any;
        doBatch: (queries: string[], callback: (err) => void) => void;
    }

    export const datatypes = {
        Long: {
            fromString: (d: string) => ''
        }
    }
}
