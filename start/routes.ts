/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//  ------ user route ------

Route.get("/user/loginStatus", "UsersController.loginStatus");
Route.get("/user/email/verify", "UsersController.verifyEmail");
Route.get("/user/isUsernameAvailable", "UsersController.isUsernameAvailable");
Route.get("/user/isEmailAvailable", "UsersController.isEmailAvailable");
Route.get("/user/me", "Users/ShowController.me");

Route.post("/user/create", "UsersController.create");
Route.post("/user/login", "UsersController.login");
Route.post("/user/logout", "UsersController.logout");
Route.post("/user/password/forgot", "UsersController.forgotPassword");
Route.post("/user/password/reset", "UsersController.resetPassword");
Route.post("/user/password/update", "UsersController.updatePassword");
Route.post("/user/update", "UsersController.update");
Route.post("/user/update/profile/photo", "UsersController.updateAvatar");
Route.post("/user/request/email/change", "UsersController.changeEmailRequest");
Route.post("/user/updateLanguage", "UsersController.updateLanguage");

//  ------ Only Admin Route For User------
Route.get("/admin/user/findById", "Admin/ShowUserController.findById");
Route.get("/admin/user/findByUsername", "Admin/ShowUserController.findByUsername");
Route.get("/admin/user/findByEmail", "Admin/ShowUserController.findByEmail");
Route.get("/admin/user/search", "Admin/ShowUserController.search");

Route.post("/admin/update/user/role", "AdminUsersController.updateRole");