/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/

;// external "@nestjs/common"
const common_namespaceObject = require("@nestjs/common");
;// external "@nestjs/core"
const core_namespaceObject = require("@nestjs/core");
;// external "tslib"
const external_tslib_namespaceObject = require("tslib");
;// external "nestjs-cassandra"
const external_nestjs_cassandra_namespaceObject = require("nestjs-cassandra");
;// external "@nestjs/config"
const config_namespaceObject = require("@nestjs/config");
;// external "@nestjs/swagger"
const swagger_namespaceObject = require("@nestjs/swagger");
;// ./src/types/decorators/client-ip.decorator.ts

const ClientIp = (0,common_namespaceObject.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const forwardedFor = request.headers['x-forwarded-for'];
    const realIp = request.headers['x-real-ip'];
    // Nếu có nhiều IP trong X-Forwarded-For, lấy IP đầu tiên
    let clientIp = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor?.split(',')[0].trim();
    // Nếu không có X-Forwarded-For, thử lấy X-Real-IP
    if (!clientIp && realIp) {
        clientIp = realIp;
    }
    // Nếu vẫn không có, lấy từ request.ip
    if (!clientIp) {
        clientIp = request.ip;
    }
    return clientIp;
});

;// external "jsonwebtoken"
const external_jsonwebtoken_namespaceObject = require("jsonwebtoken");
;// ./src/types/decorators/user.session.ts


const UserSession = (0,common_namespaceObject.createParamDecorator)((data, ctx) => {
    let req;
    if (ctx.getType() === 'graphql') {
        req = ctx.getArgs()[2].req;
    }
    else {
        req = ctx.switchToHttp().getRequest();
    }
    if (req.user)
        return req.user;
    if (req.headers) {
        if (req.headers.authorization) {
            const tokenParts = req.headers.authorization.split(' ');
            if (tokenParts[0] !== 'Bearer')
                throw new common_namespaceObject.UnauthorizedException('bad_token');
            if (!tokenParts[1])
                throw new common_namespaceObject.UnauthorizedException('bad_token');
            return external_jsonwebtoken_namespaceObject.decode(tokenParts[1]);
        }
    }
    return null;
});

;// ./src/types/decorators/index.ts



;// external "maxmind"
const external_maxmind_namespaceObject = require("maxmind");
var external_maxmind_default = /*#__PURE__*/__webpack_require__.n(external_maxmind_namespaceObject);
;// external "node:path"
const external_node_path_namespaceObject = require("node:path");
;// ./src/app/event/event.service.ts




let EventService = class EventService {
    constructor() {
        this.lookupGeo = undefined;
    }
    async onModuleInit() {
        this.lookupGeo = await external_maxmind_default().open(external_node_path_namespaceObject.join(__dirname, 'assets', 'GeoLite2-Country.mmdb'));
    }
    async collectEventFromCustomer(ip) {
        console.log(ip);
        return this.lookupGeo?.get(ip);
    }
};
EventService = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [])
], EventService);


;// ./src/app/event/event.controller.ts
var _a;





let EventController = class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    collectEventFromCustomer(ip) {
        return this.eventService.collectEventFromCustomer(ip);
    }
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Post)('collect'),
    (0,external_tslib_namespaceObject.__param)(0, ClientIp()),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Function),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [String]),
    (0,external_tslib_namespaceObject.__metadata)("design:returntype", void 0)
], EventController.prototype, "collectEventFromCustomer", null);
EventController = (0,external_tslib_namespaceObject.__decorate)([
    (0,swagger_namespaceObject.ApiTags)('Event'),
    (0,common_namespaceObject.Controller)('event'),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (_a = typeof EventService !== "undefined" && EventService) === "function" ? _a : Object])
], EventController);


;// ./src/app/event/event.module.ts




let EventModule = class EventModule {
};
EventModule = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Module)({
        controllers: [EventController],
        providers: [EventService]
    })
], EventModule);


;// ./src/app/user/user.controller.ts


let UserController = class UserController {
};
UserController = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Controller)('user')
], UserController);


;// ./src/app/user/user.service.ts


let UserService = class UserService {
};
UserService = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)()
], UserService);


;// ./src/app/user/user.module.ts




let UserModule = class UserModule {
};
UserModule = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Module)({
        controllers: [UserController],
        providers: [UserService]
    })
], UserModule);


;// ./src/repositories/scylla/channel/channel.entity.ts
var channel_entity_a, _b;


let ChannelEntity = class ChannelEntity {
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_nestjs_cassandra_namespaceObject.Column)({
        type: 'int'
    }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Number)
], ChannelEntity.prototype, "channel_id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_nestjs_cassandra_namespaceObject.Column)({
        type: 'text',
    }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], ChannelEntity.prototype, "name", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_nestjs_cassandra_namespaceObject.Column)({
        type: 'int',
    }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Number)
], ChannelEntity.prototype, "user_id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_nestjs_cassandra_namespaceObject.CreateDateColumn)(),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (channel_entity_a = typeof Date !== "undefined" && Date) === "function" ? channel_entity_a : Object)
], ChannelEntity.prototype, "created_at", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_nestjs_cassandra_namespaceObject.UpdateDateColumn)(),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ChannelEntity.prototype, "updated_at", void 0);
ChannelEntity = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_nestjs_cassandra_namespaceObject.Entity)({
        table_name: 'channel',
        key: ['channel_id'],
    })
], ChannelEntity);


;// ./src/repositories/scylla/channel/channel.repository.ts



let ChannelRepository = class ChannelRepository extends external_nestjs_cassandra_namespaceObject.Repository {
    findById(id) {
        return this.findOne({ channel_id: id });
    }
};
ChannelRepository = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_nestjs_cassandra_namespaceObject.EntityRepository)(ChannelEntity)
], ChannelRepository);


;// ./src/repositories/scylla/channel/index.ts



;// external "@street-devs/nest-snowflake-id"
const nest_snowflake_id_namespaceObject = require("@street-devs/nest-snowflake-id");
;// ./src/app/channel/channel.service.ts
var channel_service_a, channel_service_b;





let ChannelService = class ChannelService {
    constructor(channelRepository, snowflakeIdService) {
        this.channelRepository = channelRepository;
        this.snowflakeIdService = snowflakeIdService;
    }
    getById(id) {
        return this.channelRepository.findById(id);
    }
    findAll() {
        return this.channelRepository.find({});
    }
    createChannel(name) {
        const id = (Date.now() << 22) | (1 << 17) | (1 << 12) | 1;
        return this.channelRepository.save({
            channel_id: id,
            name: name,
            user_id: 1,
        }, {
            ttl: 1000
        });
    }
};
ChannelService = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__param)(0, (0,external_nestjs_cassandra_namespaceObject.InjectRepository)(ChannelRepository)),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (channel_service_a = typeof ChannelRepository !== "undefined" && ChannelRepository) === "function" ? channel_service_a : Object, typeof (channel_service_b = typeof nest_snowflake_id_namespaceObject.SnowflakeIdService !== "undefined" && nest_snowflake_id_namespaceObject.SnowflakeIdService) === "function" ? channel_service_b : Object])
], ChannelService);


;// ./src/app/channel/channel.controller.ts
var channel_controller_a;



let ChannelController = class ChannelController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    findAll() {
        return this.channelService.findAll();
    }
    create() {
        return this.channelService.createChannel('test');
    }
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Get)(''),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Function),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", []),
    (0,external_tslib_namespaceObject.__metadata)("design:returntype", void 0)
], ChannelController.prototype, "findAll", null);
(0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Post)(''),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Function),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", []),
    (0,external_tslib_namespaceObject.__metadata)("design:returntype", void 0)
], ChannelController.prototype, "create", null);
ChannelController = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Controller)('channel'),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (channel_controller_a = typeof ChannelService !== "undefined" && ChannelService) === "function" ? channel_controller_a : Object])
], ChannelController);


;// ./src/app/channel/channel.module.ts






let ChannelModule = class ChannelModule {
};
ChannelModule = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Module)({
        imports: [external_nestjs_cassandra_namespaceObject.CassandraModule.forFeature([ChannelEntity, ChannelRepository])],
        providers: [ChannelService],
        controllers: [ChannelController]
    })
], ChannelModule);


;// external "@nestjs/typeorm"
const typeorm_namespaceObject = require("@nestjs/typeorm");
;// external "typeorm"
const external_typeorm_namespaceObject = require("typeorm");
;// external "@journey-analytic/shared"
const shared_namespaceObject = require("@journey-analytic/shared");
;// ./src/repositories/maria/user/user-activity.entity.ts
var user_activity_entity_a, user_activity_entity_b, _c;



let UserActivityEntity = class UserActivityEntity {
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.PrimaryGeneratedColumn)('uuid'),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserActivityEntity.prototype, "id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'user_id', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_activity_entity_a = typeof shared_namespaceObject.UserId !== "undefined" && shared_namespaceObject.UserId) === "function" ? user_activity_entity_a : Object)
], UserActivityEntity.prototype, "userId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'store_id', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserActivityEntity.prototype, "storeId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'type', length: 128 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserActivityEntity.prototype, "type", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'fingerprint_id', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserActivityEntity.prototype, "fingerprintId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'headers', length: 256, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserActivityEntity.prototype, "headers", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'os', length: 256, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserActivityEntity.prototype, "os", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'ip', length: 256, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserActivityEntity.prototype, "ip", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'user_agent', length: 512, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserActivityEntity.prototype, "userAgent", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'addition_info', length: 512, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserActivityEntity.prototype, "additionInfo", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.CreateDateColumn)({ name: 'created_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_activity_entity_b = typeof Date !== "undefined" && Date) === "function" ? user_activity_entity_b : Object)
], UserActivityEntity.prototype, "createdAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.UpdateDateColumn)({ name: 'updated_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], UserActivityEntity.prototype, "updatedAt", void 0);
UserActivityEntity = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Entity)('user_activity')
], UserActivityEntity);


;// ./src/repositories/maria/user/user-activity.repository.ts
var user_activity_repository_a;




let UserActivityRepository = class UserActivityRepository extends external_typeorm_namespaceObject.Repository {
    constructor(dataSource) {
        super(UserActivityEntity, dataSource.createEntityManager());
    }
    async findAllByUserId(userId, skip, take) {
        return this.findAndCount({
            where: { userId },
            skip,
            take,
            order: {
                createdAt: 'DESC',
            },
        });
    }
};
UserActivityRepository = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (user_activity_repository_a = typeof external_typeorm_namespaceObject.DataSource !== "undefined" && external_typeorm_namespaceObject.DataSource) === "function" ? user_activity_repository_a : Object])
], UserActivityRepository);


;// ./src/repositories/maria/user/user-token.entity.ts
var user_token_entity_a, user_token_entity_b, user_token_entity_c, _d, _e, _f;




let UserTokenEntity = class UserTokenEntity {
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.PrimaryGeneratedColumn)('uuid'),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_token_entity_a = typeof shared_namespaceObject.UserTokenId !== "undefined" && shared_namespaceObject.UserTokenId) === "function" ? user_token_entity_a : Object)
], UserTokenEntity.prototype, "id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'user_id', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_token_entity_b = typeof shared_namespaceObject.UserId !== "undefined" && shared_namespaceObject.UserId) === "function" ? user_token_entity_b : Object)
], UserTokenEntity.prototype, "userId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'token', length: 128 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserTokenEntity.prototype, "token", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'refresh_token', length: 128 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserTokenEntity.prototype, "refreshToken", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'provider', length: 16, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_token_entity_c = typeof shared_namespaceObject.AuthProviderEnum !== "undefined" && shared_namespaceObject.AuthProviderEnum) === "function" ? user_token_entity_c : Object)
], UserTokenEntity.prototype, "provider", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'provider_id', length: 16, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserTokenEntity.prototype, "providerId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'valid', nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Boolean)
], UserTokenEntity.prototype, "valid", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.CreateDateColumn)({ name: 'created_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], UserTokenEntity.prototype, "createdAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.UpdateDateColumn)({ name: 'updated_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], UserTokenEntity.prototype, "updatedAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.ManyToOne)(() => UserEntity, (user) => user.tokens),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (_f = typeof shared_namespaceObject.IUser !== "undefined" && shared_namespaceObject.IUser) === "function" ? _f : Object)
], UserTokenEntity.prototype, "user", void 0);
UserTokenEntity = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Entity)('user_token')
], UserTokenEntity);


;// ./src/repositories/maria/user/user.entity.ts
var user_entity_a, user_entity_b, user_entity_c, user_entity_d, user_entity_e, user_entity_f, _g;




let UserEntity = class UserEntity {
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.PrimaryGeneratedColumn)('uuid'),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_entity_a = typeof shared_namespaceObject.UserId !== "undefined" && shared_namespaceObject.UserId) === "function" ? user_entity_a : Object)
], UserEntity.prototype, "id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'first_name', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "firstName", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'last_name', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "lastName", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Index)(),
    (0,external_typeorm_namespaceObject.Column)({ name: 'email', length: 256 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "email", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'username', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "username", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'profile_picture', length: 256, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "profilePicture", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'password', length: 256, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "password", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'job_title', length: 256, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "jobTitle", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'bio', length: 256, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "bio", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'urls', type: 'simple-array', nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Array)
], UserEntity.prototype, "urls", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'plan', nullable: true, default: 0 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Number)
], UserEntity.prototype, "plan", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'status', enum: shared_namespaceObject.UserStatus, type: 'enum' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_entity_b = typeof shared_namespaceObject.UserStatus !== "undefined" && shared_namespaceObject.UserStatus) === "function" ? user_entity_b : Object)
], UserEntity.prototype, "status", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'billing_code', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "billingCode", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'limit_storage', type: 'int', default: 5120 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Number)
], UserEntity.prototype, "limitStorage", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'phone_number', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "phoneNumber", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'current_project_id', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "currentProjectId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'change_pass_tx_id', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "changePassTxId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({
        name: 'owner_org',
        length: 64,
        nullable: true,
        default: 'admin',
        comment: 'Tổ chức tạo người dùng này',
    }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "ownerOrg", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'referral_by', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "referralBy", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.CreateDateColumn)({ name: 'created_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_entity_c = typeof Date !== "undefined" && Date) === "function" ? user_entity_c : Object)
], UserEntity.prototype, "createdAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.UpdateDateColumn)({ name: 'updated_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_entity_d = typeof Date !== "undefined" && Date) === "function" ? user_entity_d : Object)
], UserEntity.prototype, "updatedAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'reset_token', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserEntity.prototype, "resetToken", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.OneToMany)(() => UserTokenEntity, (token) => token.user),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Array)
], UserEntity.prototype, "tokens", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'reset_token_date', nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_entity_e = typeof Date !== "undefined" && Date) === "function" ? user_entity_e : Object)
], UserEntity.prototype, "resetTokenDate", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({
        name: 'reset_token_count',
        type: 'json',
        nullable: true,
    }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_entity_f = typeof shared_namespaceObject.IUserResetTokenCount !== "undefined" && shared_namespaceObject.IUserResetTokenCount) === "function" ? user_entity_f : Object)
], UserEntity.prototype, "resetTokenCount", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'failed_login', type: 'json', nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (_g = typeof shared_namespaceObject.IFailedLogin !== "undefined" && shared_namespaceObject.IFailedLogin) === "function" ? _g : Object)
], UserEntity.prototype, "failedLogin", void 0);
UserEntity = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Entity)('user'),
    (0,external_typeorm_namespaceObject.Index)(['ownerOrg', 'referralBy'])
], UserEntity);


;// ./src/repositories/maria/user/user-token.repository.ts
var user_token_repository_a;




let UserTokenRepository = class UserTokenRepository extends external_typeorm_namespaceObject.Repository {
    constructor(dataSource) {
        super(UserTokenEntity, dataSource.createEntityManager());
    }
};
UserTokenRepository = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (user_token_repository_a = typeof external_typeorm_namespaceObject.DataSource !== "undefined" && external_typeorm_namespaceObject.DataSource) === "function" ? user_token_repository_a : Object])
], UserTokenRepository);


;// external "crypto"
const external_crypto_namespaceObject = require("crypto");
;// external "date-fns"
const external_date_fns_namespaceObject = require("date-fns");
;// external "lodash"
const external_lodash_namespaceObject = require("lodash");
;// ./src/repositories/maria/user/user.repository.ts
var user_repository_a;







let UserRepository = class UserRepository extends external_typeorm_namespaceObject.Repository {
    constructor(dataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }
    findByEmail(email) {
        return this.findOne({
            where: {
                email: email,
            },
        });
    }
    findById(id) {
        return this.findOne({
            where: {
                id: id,
            },
        });
    }
    getByEmail(email) {
        return this.findOneBy({
            email,
        });
    }
    async updatePasswordResetToken(userId, token, resetTokenCount) {
        return await this.update({
            id: userId,
        }, {
            resetToken: this.hashResetToken(token),
            resetTokenDate: new Date().toISOString(),
            resetTokenCount,
        });
    }
    async findUserByToken(token) {
        return await this.findOne({
            where: {
                resetToken: this.hashResetToken(token),
            },
        });
    }
    hashResetToken(token) {
        return (0,external_crypto_namespaceObject.createHash)('sha256').update(token).digest('hex');
    }
    async updateCurrentStore(userId, storeId) {
        return this.update({
            id: userId,
        }, {
            currentProjectId: storeId,
        });
    }
    async adminStatistic({ period, limit }, extendWhere) {
        const formatDateByPeriod = period == 'hour' ? '%Y-%m-%d %H' : period == 'day' ? '%Y-%m-%d' : '%Y-%m';
        const oneWeekAgo = new Date();
        oneWeekAgo.setMinutes(0);
        oneWeekAgo.setSeconds(0);
        const dates = [];
        const date = new Date();
        if (period == 'hour') {
            oneWeekAgo.setHours(oneWeekAgo.getHours() - limit);
            for (let i = 0; i < limit; i++) {
                dates.push((0,external_date_fns_namespaceObject.format)(date, 'yyyy-MM-dd HH'));
                date.setHours(date.getHours() - 1);
            }
        }
        else if (period == 'day') {
            oneWeekAgo.setDate(oneWeekAgo.getDate() - limit);
            oneWeekAgo.setHours(0);
            for (let i = 0; i < limit; i++) {
                dates.push((0,external_date_fns_namespaceObject.format)(date, 'yyyy-MM-dd'));
                date.setDate(date.getDate() - 1);
            }
        }
        else {
            oneWeekAgo.setMonth(oneWeekAgo.getMonth() - limit);
            oneWeekAgo.setDate(0);
            oneWeekAgo.setHours(0);
            for (let i = 0; i < limit; i++) {
                dates.push((0,external_date_fns_namespaceObject.format)(date, 'yyyy-MM-dd'));
                date.setMonth(date.getMonth() - 1);
            }
        }
        const totalPerPeriod = await this.createQueryBuilder()
            .select([
            `date_format(created_at, '${formatDateByPeriod}') as label`,
            'count(id) as cnt',
        ])
            .where(extendWhere ?? '')
            .groupBy(`date_format(created_at, '${formatDateByPeriod}')`)
            .getRawMany();
        const rlt = [];
        for (let i = dates.length - 1; i >= 0; i--) {
            rlt.push({
                cnt: parseInt((0,external_lodash_namespaceObject.find)(totalPerPeriod, (e) => e.label == dates[i])?.cnt ?? '0'),
                label: dates[i],
            });
        }
        return rlt;
    }
    async adminCountAllInDay(query) {
        const fromDate = (0,external_date_fns_namespaceObject.startOfDay)(new Date());
        const conditions = {
            createdAt: (0,external_typeorm_namespaceObject.MoreThanOrEqual)(fromDate),
            ...(query ?? {}),
        };
        return await this.count({
            where: conditions,
        });
    }
    async getListUserByIds(ids) {
        return this.findBy({
            id: (0,external_typeorm_namespaceObject.In)(ids),
        });
    }
};
UserRepository = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (user_repository_a = typeof external_typeorm_namespaceObject.DataSource !== "undefined" && external_typeorm_namespaceObject.DataSource) === "function" ? user_repository_a : Object])
], UserRepository);


;// ./src/repositories/maria/user/user-log.entity.ts
var user_log_entity_a, user_log_entity_b;


let UserLogEntity = class UserLogEntity {
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.PrimaryGeneratedColumn)('uuid'),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserLogEntity.prototype, "id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'user_id', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserLogEntity.prototype, "userId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'changed', type: 'text' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserLogEntity.prototype, "changed", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'created_by', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], UserLogEntity.prototype, "createdBy", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.CreateDateColumn)({ name: 'created_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_log_entity_a = typeof Date !== "undefined" && Date) === "function" ? user_log_entity_a : Object)
], UserLogEntity.prototype, "createdAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.UpdateDateColumn)({ name: 'updated_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (user_log_entity_b = typeof Date !== "undefined" && Date) === "function" ? user_log_entity_b : Object)
], UserLogEntity.prototype, "updatedAt", void 0);
UserLogEntity = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Entity)('user_log')
], UserLogEntity);


;// ./src/repositories/maria/user/user-log.repository.ts
var user_log_repository_a;




let UserLogRepository = class UserLogRepository extends external_typeorm_namespaceObject.Repository {
    constructor(dataSource) {
        super(UserLogEntity, dataSource.createEntityManager());
    }
};
UserLogRepository = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (user_log_repository_a = typeof external_typeorm_namespaceObject.DataSource !== "undefined" && external_typeorm_namespaceObject.DataSource) === "function" ? user_log_repository_a : Object])
], UserLogRepository);


;// ./src/repositories/maria/user/index.ts









;// ./src/repositories/maria/project/project.entity.ts
var project_entity_a, project_entity_b;


let ProjectEntity = class ProjectEntity {
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.PrimaryGeneratedColumn)('uuid'),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], ProjectEntity.prototype, "id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'name', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], ProjectEntity.prototype, "name", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Index)(),
    (0,external_typeorm_namespaceObject.Column)({ name: 'website', length: 256 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], ProjectEntity.prototype, "website", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'tags', type: 'simple-array', nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Array)
], ProjectEntity.prototype, "tags", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Index)(),
    (0,external_typeorm_namespaceObject.Column)({ name: 'created_by', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], ProjectEntity.prototype, "createdBy", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'updated_by', length: 64, nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], ProjectEntity.prototype, "updatedBy", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.CreateDateColumn)({ name: 'created_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (project_entity_a = typeof Date !== "undefined" && Date) === "function" ? project_entity_a : Object)
], ProjectEntity.prototype, "createdAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.UpdateDateColumn)({ name: 'updated_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (project_entity_b = typeof Date !== "undefined" && Date) === "function" ? project_entity_b : Object)
], ProjectEntity.prototype, "updatedAt", void 0);
ProjectEntity = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Entity)('project')
], ProjectEntity);


;// ./src/repositories/maria/project/project.repository.ts
var project_repository_a;




let ProjectRepository = class ProjectRepository extends external_typeorm_namespaceObject.Repository {
    constructor(dataSource) {
        super(ProjectEntity, dataSource.createEntityManager());
    }
};
ProjectRepository = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (project_repository_a = typeof external_typeorm_namespaceObject.DataSource !== "undefined" && external_typeorm_namespaceObject.DataSource) === "function" ? project_repository_a : Object])
], ProjectRepository);


;// ./src/repositories/maria/project/index.ts



;// ./src/repositories/maria/session/session.entity.ts
var session_entity_a, session_entity_b;


let SessionEntity = class SessionEntity {
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.PrimaryGeneratedColumn)('uuid'),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'project_id', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "projectId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'website_id', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "websiteId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'host', length: 256 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "host", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'browser', length: 128 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "browser", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'os', length: 128 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "os", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'device', length: 128 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "device", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'screen', length: 128 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "screen", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'language', length: 32 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "language", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'country', length: 32 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "country", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'city', length: 32 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "city", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'share_id', length: 32 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "shareId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'referrer', length: 32 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], SessionEntity.prototype, "referrer", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.CreateDateColumn)({ name: 'created_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (session_entity_a = typeof Date !== "undefined" && Date) === "function" ? session_entity_a : Object)
], SessionEntity.prototype, "createdAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.UpdateDateColumn)({ name: 'updated_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (session_entity_b = typeof Date !== "undefined" && Date) === "function" ? session_entity_b : Object)
], SessionEntity.prototype, "updatedAt", void 0);
SessionEntity = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Entity)('session'),
    (0,external_typeorm_namespaceObject.Index)(['projectId', 'websiteId'])
], SessionEntity);


;// ./src/repositories/maria/session/session.repository.ts
var session_repository_a;




let SessionRepository = class SessionRepository extends external_typeorm_namespaceObject.Repository {
    constructor(dataSource) {
        super(SessionEntity, dataSource.createEntityManager());
    }
};
SessionRepository = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (session_repository_a = typeof external_typeorm_namespaceObject.DataSource !== "undefined" && external_typeorm_namespaceObject.DataSource) === "function" ? session_repository_a : Object])
], SessionRepository);


;// ./src/repositories/maria/session/index.ts



;// ./src/repositories/maria/website/website.entity.ts
var website_entity_a, website_entity_b;


let WebsiteEntity = class WebsiteEntity {
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.PrimaryGeneratedColumn)('uuid'),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], WebsiteEntity.prototype, "id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'title', length: 256 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], WebsiteEntity.prototype, "title", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'keywords', type: 'simple-array' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Array)
], WebsiteEntity.prototype, "keywords", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'projectId', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], WebsiteEntity.prototype, "projectId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'domain', length: 128 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], WebsiteEntity.prototype, "domain", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'created_by', length: 32 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], WebsiteEntity.prototype, "createdBy", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.CreateDateColumn)({ name: 'created_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (website_entity_a = typeof Date !== "undefined" && Date) === "function" ? website_entity_a : Object)
], WebsiteEntity.prototype, "createdAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.UpdateDateColumn)({ name: 'updated_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (website_entity_b = typeof Date !== "undefined" && Date) === "function" ? website_entity_b : Object)
], WebsiteEntity.prototype, "updatedAt", void 0);
WebsiteEntity = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Entity)('website')
], WebsiteEntity);


;// ./src/repositories/maria/website/website.repository.ts
var website_repository_a;




let WebsiteRepository = class WebsiteRepository extends external_typeorm_namespaceObject.Repository {
    constructor(dataSource) {
        super(WebsiteEntity, dataSource.createEntityManager());
    }
};
WebsiteRepository = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (website_repository_a = typeof external_typeorm_namespaceObject.DataSource !== "undefined" && external_typeorm_namespaceObject.DataSource) === "function" ? website_repository_a : Object])
], WebsiteRepository);


;// ./src/repositories/maria/website/index.ts



;// ./src/repositories/maria/member/member.entity.ts
var member_entity_a, member_entity_b, member_entity_c, member_entity_d, member_entity_e;




let MemberEntity = class MemberEntity {
};
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.PrimaryGeneratedColumn)('uuid'),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], MemberEntity.prototype, "id", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Index)(),
    (0,external_typeorm_namespaceObject.Column)({ name: 'user_id', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (member_entity_a = typeof shared_namespaceObject.UserId !== "undefined" && shared_namespaceObject.UserId) === "function" ? member_entity_a : Object)
], MemberEntity.prototype, "userId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Index)(),
    (0,external_typeorm_namespaceObject.Column)({ name: 'project_id', length: 64 }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", String)
], MemberEntity.prototype, "projectId", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({ name: 'roles', type: 'simple-array', nullable: true }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", Array)
], MemberEntity.prototype, "roles", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Column)({
        name: 'status',
        type: 'enum',
        enum: shared_namespaceObject.MemberStatus,
    }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (member_entity_b = typeof shared_namespaceObject.MemberStatus !== "undefined" && shared_namespaceObject.MemberStatus) === "function" ? member_entity_b : Object)
], MemberEntity.prototype, "status", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.CreateDateColumn)({ name: 'created_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (member_entity_c = typeof Date !== "undefined" && Date) === "function" ? member_entity_c : Object)
], MemberEntity.prototype, "createdAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.UpdateDateColumn)({ name: 'updated_at' }),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (member_entity_d = typeof Date !== "undefined" && Date) === "function" ? member_entity_d : Object)
], MemberEntity.prototype, "updatedAt", void 0);
(0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.ManyToOne)(() => UserEntity),
    (0,external_typeorm_namespaceObject.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    (0,external_tslib_namespaceObject.__metadata)("design:type", typeof (member_entity_e = typeof shared_namespaceObject.IUser !== "undefined" && shared_namespaceObject.IUser) === "function" ? member_entity_e : Object)
], MemberEntity.prototype, "user", void 0);
MemberEntity = (0,external_tslib_namespaceObject.__decorate)([
    (0,external_typeorm_namespaceObject.Entity)('member')
], MemberEntity);


;// ./src/repositories/maria/member/member.repository.ts
var member_repository_a;





let MemberRepository = class MemberRepository extends external_typeorm_namespaceObject.Repository {
    constructor(dataSource) {
        super(MemberEntity, dataSource.createEntityManager());
    }
    async findMemberByUserId(storeId, userId) {
        const member = await this.findOneBy({
            storeId: storeId,
            userId: userId,
        });
        if (!member)
            return null;
        return member;
    }
    async findMemberInStore(storeId, userId) {
        return await this.findAndCount({
            where: {
                storeId: storeId,
                userId: userId,
            },
            relations: ['user'],
        });
    }
    async findAllMemberInStore(storeId) {
        return await this.findAndCount({
            where: {
                storeId: storeId,
            },
            relations: ['user'],
        });
    }
    async findAllMemberInStore2(storeId) {
        return await this.find({
            where: {
                storeId: storeId,
            },
            relations: ['user'],
        });
    }
    async addMember(storeId, member, isDefault) {
        return await this.save({
            userId: member.userId,
            roles: member.roles,
            status: member.memberStatus,
            storeId: storeId,
            isDefault,
        });
    }
    async findUserActiveMembers(userId) {
        const requestQuery = {
            userId: userId,
            status: shared_namespaceObject.MemberStatus.ACTIVE,
        };
        return await this.findBy(requestQuery);
    }
    async isMemberOfStore(storeId, userId) {
        return this.existsBy({
            storeId: storeId,
            userId: userId,
        });
    }
};
MemberRepository = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Injectable)(),
    (0,external_tslib_namespaceObject.__metadata)("design:paramtypes", [typeof (member_repository_a = typeof external_typeorm_namespaceObject.DataSource !== "undefined" && external_typeorm_namespaceObject.DataSource) === "function" ? member_repository_a : Object])
], MemberRepository);


;// ./src/repositories/maria/member/index.ts



;// ./src/repositories/maria/entities.ts





const entities = [
    UserEntity,
    UserTokenEntity,
    UserLogEntity,
    UserActivityEntity,
    ProjectEntity,
    SessionEntity,
    WebsiteEntity,
    MemberEntity
];

;// ./src/app.module.ts










let AppModule = class AppModule {
};
AppModule = (0,external_tslib_namespaceObject.__decorate)([
    (0,common_namespaceObject.Module)({
        imports: [
            config_namespaceObject.ConfigModule.forRoot({
                isGlobal: true,
            }),
            nest_snowflake_id_namespaceObject.SnowflakeIdModule.forRoot({
                global: true,
                customEpoch: 1737621145000, // Custom epoch (Jan 23, 2025)
                machineId: {
                    workerId: 1, // Worker ID
                    dataCenterId: 1, // Data Center ID
                },
            }),
            external_nestjs_cassandra_namespaceObject.CassandraModule.forRootAsync({
                imports: [config_namespaceObject.ConfigModule],
                inject: [config_namespaceObject.ConfigService],
                useFactory: (configService) => ({
                    clientOptions: {
                        localDataCenter: configService.get('SCYLLA_LOCAL_DATACENTER'),
                        contactPoints: [configService.get('SCYLLA_URL') ?? ''],
                        protocolOptions: {
                            port: configService.get('SCYLLA_PORT')
                        },
                        keyspace: configService.get('SCYLLA_KEYSPACE'),
                        socketOptions: { readTimeout: 60000 },
                    },
                    ormOptions: {
                        defaultReplicationStrategy: {
                            class: 'SimpleStrategy',
                            replication_factor: 1
                        },
                        migration: 'safe',
                    },
                }),
            }),
            typeorm_namespaceObject.TypeOrmModule.forRootAsync({
                imports: [config_namespaceObject.ConfigModule],
                inject: [config_namespaceObject.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('MYSQL_HOST'),
                    port: parseInt(config.get('MYSQL_PORT') ?? '3306'),
                    username: config.get('MYSQL_USER'),
                    password: config.get('MYSQL_PASS'),
                    database: config.get('MYSQL_DB'),
                    entities: [...entities],
                    charset: 'utf8mb4_unicode_ci',
                    synchronize: false,
                }),
            }),
            EventModule,
            UserModule,
            ChannelModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);


;// external "process"
const external_process_namespaceObject = require("process");
var external_process_default = /*#__PURE__*/__webpack_require__.n(external_process_namespaceObject);
;// external "helmet"
const external_helmet_namespaceObject = require("helmet");
var external_helmet_default = /*#__PURE__*/__webpack_require__.n(external_helmet_namespaceObject);
;// external "express"
const external_express_namespaceObject = require("express");
;// ./src/main.ts
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */








const corsOptionsDelegate = function (req, callback) {
    const corsOptions = {
        origin: false,
        preflightContinue: false,
        maxAge: 86400,
        allowedHeaders: ['Content-Type', 'Authorization', 'sentry-trace'],
        methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        exposedHeaders: ['Content-Disposition'],
    };
    if (['dev', 'test', 'local'].includes((external_process_default()).env.NODE_ENV ?? 'dev') ||
        isBlueprintRoute(req.url)) {
        corsOptions.origin = '*';
    }
    else {
        corsOptions.origin = [
            (external_process_default()).env.FRONT_BASE_URL ?? '',
            (external_process_default()).env.API_ROOT_URL ?? '',
            'http://localhost:4200',
        ];
        if ((external_process_default()).env.WIDGET_BASE_URL && Array.isArray(corsOptions.origin)) {
            corsOptions.origin.push((external_process_default()).env.WIDGET_BASE_URL);
        }
    }
    callback(null, corsOptions);
};
async function bootstrap() {
    const app = await core_namespaceObject.NestFactory.create(AppModule);
    const configService = app.get(config_namespaceObject.ConfigService);
    const apiVersion = configService.get('APP_VERSION');
    const globalPrefix = `api/${apiVersion}`;
    app.setGlobalPrefix(globalPrefix);
    // * swagger
    const config = new swagger_namespaceObject.DocumentBuilder()
        .setTitle(configService.get('APP_NAME'))
        .setDescription(configService.get('APP_DESCRIPTION'))
        .setVersion(apiVersion)
        .addTag('Auth')
        .addTag('User')
        .addTag('Channel')
        .addTag('Event')
        .addBearerAuth()
        .build();
    const document = swagger_namespaceObject.SwaggerModule.createDocument(app, config);
    swagger_namespaceObject.SwaggerModule.setup('api', app, document);
    // * cors
    app.use(external_helmet_default()({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
    }));
    app.use((0,external_express_namespaceObject.urlencoded)({ extended: true, limit: '2mb', parameterLimit: 10000 }));
    app.useGlobalPipes(new common_namespaceObject.ValidationPipe({ transform: true }));
    app.enableCors(corsOptionsDelegate);
    const port = (external_process_default()).env.PORT || 3000;
    await app.listen(port);
    common_namespaceObject.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
function isBlueprintRoute(url) {
    return url.startsWith('/v1/blueprints');
}

/******/ })()
;
//# sourceMappingURL=main.js.map