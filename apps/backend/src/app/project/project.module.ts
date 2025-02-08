import {Module} from "@nestjs/common";
import {ProjectController} from "./project.controller";
import {ProjectService} from "./project.service";
import {
    ApiKeyRepository,
    MemberRepository,
    ProjectRepository,
    SessionRepository,
    WebsiteRepository
} from "../../repositories/maria";
import {TypeOrmModule} from "@nestjs/typeorm";

const repositories = [
    ProjectRepository,
    MemberRepository,
    ApiKeyRepository,
    WebsiteRepository,
    SessionRepository,
];

@Module({
    imports: [TypeOrmModule.forFeature(repositories)],
    controllers: [ProjectController],
    providers: [ProjectService, ...repositories],
})
export class ProjectModule {
}
