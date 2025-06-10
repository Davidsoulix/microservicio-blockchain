/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('blocks', function (table) {
        table.increments('id').primary();
        table.integer('index').notNullable();
        table.timestamp('timestamp').notNullable();
        table.jsonb('data').notNullable(); // lote, id_proveedor, fecha
        table.text('qrImageBase64'); // usa text porque es largo
        table.string('previous_hash').notNullable();
        table.string('hash').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('blocks');
};
