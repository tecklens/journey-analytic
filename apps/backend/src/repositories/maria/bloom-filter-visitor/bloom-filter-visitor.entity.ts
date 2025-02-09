import {Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn} from "typeorm";

@Entity('bloom-filter-visitor')
export class BloomFilterVisitorEntity {
    @Index()
    @PrimaryColumn({name: 'website_id', length: 64})
    websiteId: string;

    @Column({name: 'filter_data', type: 'simple-json'})
    filerData: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}