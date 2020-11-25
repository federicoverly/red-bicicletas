
var express = require('express');
var router = express.Router();
var ControllerUsuario = require('../controllers/ControllerUsuario')

router.get("/",ControllerUsuario.list);
router.get("/create",ControllerUsuario.create_get);
router.get("/:id/update",ControllerUsuario.update_get);

router.post("/:id/update",ControllerUsuario.update);
router.post("/create",ControllerUsuario.create);

router.post("/:id/delete",ControllerUsuario.delete);


module.exports = router;
