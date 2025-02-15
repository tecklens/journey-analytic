import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {EventModule} from "./app/event/event.module";
import {UserModule} from "./app/user/user.module";
import {SnowflakeIdModule} from "@street-devs/nest-snowflake-id";
import {TypeOrmModule} from "@nestjs/typeorm";
import {entities} from "./repositories/maria/entities";
import {AuthModule} from "./app/auth/auth.module";
import {CacheModule} from "@nestjs/cache-manager";
import {createKeyv} from "@keyv/redis";
import {BullModule} from "@nestjs/bullmq";
import {addTransactionalDataSource} from "typeorm-transactional";
import {DataSource} from "typeorm";
import {ProjectModule} from "./app/project/project.module";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {RequestSizeInterceptor} from "./types/decorators/log-request-size.interceptor";
import {ScyllaModule} from "./app/scylla/scylla.module";
import {ScheduleModule} from "@nestjs/schedule";
import {EPOCH_TIME} from "./consts";
import {WebsiteModule} from "./app/website/website.module";
import {join} from "path";
import * as process from 'process';

console.log(process.env.NODE_ENV, join(__dirname, `.env.production`))

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === 'production' ? join(__dirname, `.env.production`) : '.env',
        }),
        ScheduleModule.forRoot(),
        CacheModule.register({
            isGlobal: true,
            store: createKeyv({
                url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT ?? "3306"}`,
                socket: {
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT ?? "3306"),
                    reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
                    keepAlive: 30000,
                },
            }),
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    connection: {
                        host: config.get("REDIS_HOST"),
                        port: parseInt(config.get("REDIS_PORT") ?? "6379"),
                    },
                };
            },
        }),
        SnowflakeIdModule.forRoot({
            global: true,
            customEpoch: EPOCH_TIME, // Custom epoch (Jan 23, 2025)
            machineId: {
                workerId: 1, // Worker ID
                dataCenterId: 1, // Data Center ID
            },
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: "mysql",
                host: config.get("MYSQL_HOST"),
                port: parseInt(config.get("MYSQL_PORT") ?? "3306"),
                username: config.get("MYSQL_USER"),
                password: config.get<string>("MYSQL_PASS"),
                database: config.get<string>("MYSQL_DB"),
                entities: [...entities],
                charset: "utf8mb4_unicode_ci",
                synchronize: true,
            }),
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error("Invalid options passed");
                }

                return addTransactionalDataSource(new DataSource(options));
            },
        }),
        AuthModule,
        EventModule,
        UserModule,
        ProjectModule,
        ScyllaModule,
        WebsiteModule,
        // ChannelModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestSizeInterceptor,
        },
    ],
})
export class AppModule {
}
