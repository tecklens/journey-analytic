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
    }

    export interface datatypes {
        Long: any;
    }
}
