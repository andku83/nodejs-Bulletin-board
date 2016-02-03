var express = require('express');
var router = express.Router();
var UserController = require('../controllers/userController');
var ItemController = require('../controllers/itemController');
var Auth = require('../middleware/auth');


    /*                   USER                      */
/* Login user */
router.post('/login', UserController.login);

/* Register */
router.post('/register', UserController.register);

/* Get current user */
router.get('/me', Auth, UserController.get_me);

/* Update current user */
router.put('/me', Auth, UserController.put_me);

/* Search users */
router.get('/user', UserController.search_user);

/* Get user by ID */
router.get('/user/:id', Auth, UserController.get_user);


/*                   ITEM                      */
/* Search items */
router.get('/item', ItemController.search_item);

/* Get item by ID */
router.get('/item/:id', ItemController.get_item);

/* Create item */
router.post('/item', Auth, ItemController.create_item);

/* Update item */
router.put('/item/:id', Auth, ItemController.put_item);

/* Delete item */
router.delete('/item/:id', Auth, ItemController.delete);


/*                  ITEM IMAGE                  */
/* Upload item image */
router.post('/item/:id/image', Auth, ItemController.image_post);

/* delete item image */
router.delete('/item/:id/image', Auth, ItemController.image_del);


module.exports = router;
