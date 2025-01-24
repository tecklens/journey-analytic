import {Module} from '@nestjs/common';
import {CassandraModule} from "nestjs-cassandra";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {EventModule} from './app/event/event.module';
import {UserModule} from './app/user/user.module';
import {ChannelModule} from './app/channel/channel.module';
import {SnowflakeIdModule} from "@street-devs/nest-snowflake-id";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        SnowflakeIdModule.forRoot({
            global: true,
            customEpoch: 1737621145000, // Custom epoch (Jan 23, 2025)
            machineId: {
                workerId: 1, // Worker ID
                dataCenterId: 1,// Data Center ID
            },
        }),
        CassandraModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                clientOptions: {
                    localDataCenter: configService.get('SCYLLA_LOCAL_DATACENTER'),
                    contactPoints: [configService.get<string>('SCYLLA_URL') ?? ''],
                    protocolOptions: {
                        port: configService.get<number>('SCYLLA_PORT')
                    },
                    keyspace: configService.get('SCYLLA_KEYSPACE'),
                    socketOptions: {readTimeout: 60000},
                },
                ormOptions: {
                    defaultReplicationStrategy : {
                        class: 'SimpleStrategy',
                        replication_factor: 1
                    },
                    migration: 'safe',
                },
            }),
        }),
        EventModule,
        UserModule,
        ChannelModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
