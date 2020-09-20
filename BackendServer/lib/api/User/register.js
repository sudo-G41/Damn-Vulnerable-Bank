var express = require('express');
var router = express.Router();
var Model = require('../../../models/index');
var Response = require('../../Response');
var statusCodes = require('../../statusCodes');

/**
 * Registration route
 * This endpoint allows the user to register
 * Additionally this also creates a new account for this user
 * @path                             - /api/user/register
 * @middleware                       - Checks admin authorization
 * @param username                   - Username to login
 * @param password                   - Password to login
 * @return                           - Status
 */
router.post('/', (req, res) => {
    var r = new Response();
    let username = req.body.username;
    let password = req.body.password;
    let account_number = Math.random() * 888888 + 111111;
    
    Model.users.findAll({
        where: {
            username: username
        }
    }).then((data) => {
        if(data == "") {
            Model.users.findOne({
                account_number: account_number
            }).then((data) => {
                // Regenerates new account number if account number exists
                if(data) {
                    account_number = Math.random() * 888888 + 111111;
                }

                Model.users.create({
                    username: username,
                    password: password,
                    account_number: account_number
                }).then(() => {
                    r.status = statusCodes.SUCCESS;
                    res.json(r);
                }).catch((err) => {
                    r.status = statusCodes.SERVER_ERROR;
                    r.data = {
                        "error": err.toString()
                    };
                    res.json(r);
                });
            });
        } else {
            r.status = statusCodes.BAD_INPUT;
            r.data = {
                "message": "Username already taken"
            };
            return res.json(r);
        }
    }).catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            "error": err.toString()
        };
        return res.json(r);
    });
});

module.exports = router;