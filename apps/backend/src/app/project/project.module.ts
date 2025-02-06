import {Module} from "@nestjs/common";
import {ProjectController} from "./project.controller";
import {ProjectService} from "./project.service";
import {MemberRepository, ProjectRepository} from "../../repositories/maria";
import {TypeOrmModule} from "@nestjs/typeorm";

const repositories = [
  ProjectRepository,
  MemberRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature(repositories)],
  controllers: [ProjectController],
  providers: [ProjectService, ...repositories],
})
export class ProjectModule {}
