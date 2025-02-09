import {Module} from "@nestjs/common";
import {ProjectController} from "./project.controller";
import {ProjectService} from "./project.service";
import {
    ApiKeyRepository,
    BloomFilterVisitorRepository,
    MemberRepository,
    ProjectRepository,
    SessionRepository,
    WebsiteRepository
} from "../../repositories/maria";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BloomService} from "./bloom-filter.service";

const repositories = [
    ProjectRepository,
    MemberRepository,
    ApiKeyRepository,
    WebsiteRepository,
    SessionRepository,
    BloomFilterVisitorRepository,
];

@Module({
    imports: [TypeOrmModule.forFeature(repositories)],
    controllers: [ProjectController],
    providers: [ProjectService, BloomService, ...repositories],
})
export class ProjectModule {
}
