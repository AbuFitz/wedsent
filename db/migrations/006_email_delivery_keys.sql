-- One logical invitation email per active invitation generation and recipient.
-- A rotated invitation has a new invitation id and may be sent afresh.
alter table message_deliveries add column delivery_key text;
create unique index message_deliveries_delivery_key_uq on message_deliveries(delivery_key) where delivery_key is not null;
