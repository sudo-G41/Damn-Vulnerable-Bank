var express = require('express');
var multer = require('multer');
var router = express.Router();
var Model = require('../../../models/index');
var Response = require('../../Response');
var statusCodes = require('../../statusCodes');
var { validateUserToken } = require("../../../middlewares/validateToken");

// 파일 저장 설정
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // 업로드 폴더 설정
    },
    filename: function (req, file, cb) {
        cb(null, `${req.account_number}_${Date.now()}_${file.originalname}`); // 고유한 파일 이름 생성
    }
});

var upload = multer({ storage: storage });

/**
 * Profile image upload route
 * This endpoint allows the user to upload a profile image
 * @path                             - /api/user/profile/upload
 * @middleware
 * @return                           - Status: Success/Error
 */
router.post('/upload', validateUserToken, upload.single('profile_image'), (req, res) => {
    var r = new Response();
    if (!req.file) {
        r.status = statusCodes.BAD_REQUEST;
        r.data = {
            "message": "No file uploaded"
        };
        return res.json(r);
    }

    // 파일 경로 업데이트
    const filePath = `/uploads/${req.file.filename}`;
    Model.users.update({ profile_image: filePath }, { where: { account_number: req.account_number } })
        .then(() => {
            r.status = statusCodes.SUCCESS;
            r.data = {
                "message": "Profile image uploaded successfully",
                "file_path": filePath
            };
            res.json(r);
        })
        .catch((err) => {
            r.status = statusCodes.SERVER_ERROR;
            r.data = {
                "message": err.toString()
            };
            res.json(r);
        });
});

module.exports = router;
