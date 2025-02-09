import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('hourly-stats')
export class HourlyStatsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({name: 'website_id', length: 64})
    websiteId: string;

    @Column({name: 'page_views', type: 'int', default: 0})
    pageViews: number;

    @Column({name: 'visitors', type: 'int', default: 0})
    visitors: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}