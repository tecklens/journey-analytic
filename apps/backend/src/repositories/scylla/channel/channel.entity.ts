import {Column, CreateDateColumn, Entity, UpdateDateColumn} from 'nestjs-cassandra';

@Entity({
    table_name: 'channel',
    key: ['channel_id'],
})
export class ChannelEntity {
    @Column({
        type: 'int'
    })
    channel_id: number;

    @Column({
        type: 'text',
    })
    name: string;

    @Column({
        type: 'int',
    })
    user_id: number;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}