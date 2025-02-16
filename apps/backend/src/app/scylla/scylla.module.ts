import {Logger, Module} from "@nestjs/common";
import * as cassandra from 'express-cassandra';
import {scyllaEntities} from "../../repositories/scylla";
import {ConfigService} from "@nestjs/config";

@Module({
    providers: [
        {
            provide: 'SCYLLA_CLIENT',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const models = cassandra.createClient({
                    clientOptions: {
                        localDataCenter: configService.get("SCYLLA_LOCAL_DATACENTER"),
                        contactPoints: [configService.get<string>("SCYLLA_URL") ?? ""],
                        protocolOptions: {
                            port: configService.get<number>("SCYLLA_PORT"),
                        },
                        keyspace: configService.get("SCYLLA_KEYSPACE"),
                        socketOptions: { readTimeout: 60000 },
                    },
                    ormOptions: {
                        debug: true,
                        defaultReplicationStrategy: {
                            class: "SimpleStrategy",
                            replication_factor: 1,
                        },
                        migration: "alter",
                    },
                });

                // Load toàn bộ schema từ models/
                scyllaEntities.forEach(model => {
                    const schema = models.loadSchema(model.table_name, model)
                    schema.syncDB(function(err: any, result: any) {
                        console.log(result)
                        if (err) throw err;
                        // result == true if any database schema was updated
                        // result == false if no schema change was detected in your models
                    });
                })

                Logger.log('✅ Kết nối Scylla thành công');
                return models;
            },
        },
    ],
    exports: ['SCYLLA_CLIENT'],
})
export class ScyllaModule {}
