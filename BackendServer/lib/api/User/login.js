var express = require('express');
var router = express.Router();
var Model = require('../../../models/index');
var Response = require('../../Response');
var statusCodes = require('../../statusCodes');
var { encryptResponse, decryptRequest } = require("../../../middlewares/crypt");
const jwt = require("jsonwebtoken");

/**
 * Login route
 * This endpoint allows the user to login
 * @path                             - /api/user/login
 * @middleware                       - Checks admin authorization
 * @param username                   - Username to login
 * @param password                   - Password to login
 * @return                           - JWT token
 */
router.post('/', decryptRequest, (req, res) => {
    var r = new Response();
    let username = req.body.username;
    let password = req.body.password;
    
    Model.users.findOne({
        where: {
            username: username,
            password: password
        }
    }).then(async (data) => {
        if(data) {
            console.log("data:",data);
            console.log("sign : ", data.sign_in);
            if(data.sign_in < 5) {
                //로그인 성공으로 인한 초기화
                await data.update({ sign_in: 0 });
                const accessToken = jwt.sign({
                    username: data.username,
                    is_admin: data.is_admin
                }, "secret");
                r.status = statusCodes.SUCCESS;
                r.data = {
                    "accessToken": accessToken,
                    "message": "Success access"
                };
                return res.json(encryptResponse(r));
            } else {
                r.status = statusCodes.FORBIDDEN;
                r.data = {
                    "message": "count max"
                }
                return res.json(encryptResponse(r));
                // return res.json(r);
            }
        } else {

            //해당 아이디 증가
            Model.users.findOne({
                where: {
                    username: username
                }
            }).then(async (data) => {
                if(data) {
                    await data.update({ sign_in: data.sign_in+1 });
                }
            })

            r.status = statusCodes.BAD_INPUT;
            r.data = {
                "message": "Incorrect username or password"
            }
            return res.json(encryptResponse(r));
            // return res.json(r);
        }
    }).catch((err) => {
        r.status = statusCodes.SERVER_ERROR;
        r.data = {
            "message": err.toString()
        };
        return res.json(encryptResponse(r));
        // return res.json(r);
    });
});

module.exports = router;