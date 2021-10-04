const { request, response } = require("express");
const ServicePostgres = require("../services/postgres");
const _servicePg = new ServicePostgres();

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
const getElectronicBills = async (request, response) => {
    let responseJSON = {};
    try {
        const sql = "select * from facturaelectronica";
        let responseDB = await _servicePg.execute(sql);
        let rowCount = responseDB.rowCount;
        let rows = responseDB.rows;
        responseJSON.ok = true;
        responseJSON.message = "Services ok";
        responseJSON.info = rows;
        responseJSON.metainfo = { total: rowCount };
        response.status(200).send(responseJSON);
    } catch (error) {
        responseJSON.ok = false;
        responseJSON.message = "Error while select electronics bills for this user.";
        responseJSON.info = error.message;
        response.status(400).send(responseJSON);
    }
};

module.exports = {
  getElectronicBills,
};