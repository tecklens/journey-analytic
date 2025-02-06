import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventModule } from "./app/event/event.module";
import { UserModule } from "./app/user/user.module";
import { SnowflakeIdModule } from "@street-devs/nest-snowflake-id";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "./repositories/maria/entities";
import { AuthModule } from "./app/auth/auth.module";
import { CacheModule } from "@nestjs/cache-manager";
import { createKeyv } from "@keyv/redis";
import { BullModule } from "@nestjs/bullmq";
import { addTransactionalDataSource } from "typeorm-transactional";
import { DataSource } from "typeorm";
import { ProjectModule } from "./app/project/project.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
      customEpoch: 1737621145000, // Custom epoch (Jan 23, 2025)
      machineId: {
        workerId: 1, // Worker ID
        dataCenterId: 1, // Data Center ID
      },
    }),
    // CassandraModule.forRootAsync({
    //     imports: [ConfigModule],
    //     inject: [ConfigService],
    //     useFactory: (configService: ConfigService) => ({
    //         clientOptions: {
    //             localDataCenter: configService.get('SCYLLA_LOCAL_DATACENTER'),
    //             contactPoints: [configService.get<string>('SCYLLA_URL') ?? ''],
    //             protocolOptions: {
    //                 port: configService.get<number>('SCYLLA_PORT')
    //             },
    //             keyspace: configService.get('SCYLLA_KEYSPACE'),
    //             socketOptions: {readTimeout: 60000},
    //         },
    //         ormOptions: {
    //             defaultReplicationStrategy : {
    //                 class: 'SimpleStrategy',
    //                 replication_factor: 1
    //             },
    //             migration: 'safe',
    //         },
    //     }),
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get("MYSQL_HOST"),
        port: parseInt(config.get("MYSQL_PORT") ?? "3306"),
        username: config.get("MYSQL_USER"),
        password: config.get<any>("MYSQL_PASS"),
        database: config.get<any>("MYSQL_DB"),
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
    // ChannelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
