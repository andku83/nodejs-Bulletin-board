# nodejs-Bulletin-board

REST API для сайта “Доска объявлений”
На сайте пользователи выкладывают товары, которые хотели бы продать.

####Основные возможности:
* авторизация
* регистрация
* получение/редактирование данных текущего пользователя
* смена пароля (при этом необходимо указать текущий пароль)
* поиск и сортировка товаров
* загружать/удалять изображение для товара
* поиск пользователей
* создание/редактирование/удаление товара авторизованным пользователем

    Идентификация текущего пользователя происходит по сгенерированному токену, который передается в заголовок Authorization.

    Ошибки валидации имеют общий вид:

        422, Unprocessable Entity

        Body:
            [
            {"field":"title","message":"Title should contain at least 3 characters"},
            ...
            ]
    - field - название поля к которому относится ошибка
    - message - сообщение об ошибке

###
####Models\

* models\user.js
* models\item.js

####Controllers\

* controllers\userController.js
* controllers\itemController.js

####Middleware\

* middleware\auth.js - авторизация по токену

####Routes\

* routes\api.js - маршрутизация для API

##### USER
* /login POST - Login user
* /register POST - Register
* /me GET - Get current user
* /me PUT - Update current user
* /user?name=Alex&email=alex@mail.com GET - Search users

    Params:
    - name - (optional)
    - email - (optional)
* /user/{id} GET - Get user by ID

##### ITEM
* /item?title=notebook&user_id=1&order_by=created_at&order_type=desc GET - Search items

    Params:
    - title - (optional)
    - user_id - (optional)
    - order_by - [price|created_at] (optional, default=created_at)
    - order_type - [asc|desc] (optional, default=desc)
* /item/{id} GET - Get item by ID
* /item POST - Create item
* /item/{id} PUT - Update item
* /item/{id} DELETE - Delete item

##### ITEM IMAGE
* /item/{id}/image POST - Upload item image
* /item/{id}/image DELETE - Delete item image

