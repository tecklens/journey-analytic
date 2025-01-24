CREATE KEYSPACE janal_dev
  WITH REPLICATION = {
   'class' : 'SimpleStrategy',
   'replication_factor' : 1
  };

CREATE TABLE channel
(
    channel_id int,
    name       text,
    user_id    int,
    author_id  bigint,
    created_at timestamp,
    updated_at timestamp,
    PRIMARY KEY (channel_id)
);