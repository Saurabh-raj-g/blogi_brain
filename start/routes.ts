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

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
    return { hello: "world" };
});

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
Route.get(
    "/admin/user/findByUsername",
    "Admin/ShowUserController.findByUsername"
);
Route.get("/admin/user/findByEmail", "Admin/ShowUserController.findByEmail");
Route.get("/admin/user/search", "Admin/ShowUserController.search");

Route.post("/admin/update/user/role", "AdminUsersController.updateRole");

//  ------Post Route -> User------
Route.post("/user/post/create", "PostsController.create");
Route.get("/post/search", "Posts/ShowController.search");
Route.get("post/:id", "Posts/ShowController.findById");

//  ------Post Route -> Only Admin------
Route.post("/admin/post/ban", "AdminPostsController.banPost");
Route.get("/admin/post/search", "Admin/ShowAdminPostsController.search");
Route.get("/admin/post/:id", "Admin/ShowAdminPostsController.findById");

// ------Likes Post Route -> Likes ------
Route.get("/post/like/totalLikes", "Likes/ShowController.totalLikes");
Route.get("/post/like/totalDislikes", "Likes/ShowController.totalDislikes");
Route.get("/post/like/status", "Likes/ShowController.postLikedStatus");
Route.post("/post/like/createLike", "LikesController.createLike");
Route.post("/post/like/createDislike", "LikesController.createDislike");
Route.post("/post/like/delete", "LikesController.delete");

// ------Likes Comments Route -> Likes ------
Route.get("/comment/like/totalLikes", "CommentLikes/ShowController.totalLikes");
Route.get("/comment/like/totalDislikes", "CommentLikes/ShowController.totalDislikes");
Route.get("/comment/like/status", "CommentLikes/ShowController.postLikedStatus");
Route.post("/comment/like/createLike", "CommentLikesController.createLike");
Route.post("/comment/like/createDislike", "CommentLikesController.createDislike");
Route.post("/comment/like/delete", "CommentLikesController.delete");

// ------Comments Route -> User ------
Route.post("/user/comment/create", "CommentsController.create");
Route.post("/comment/update", "CommentsController.update");
Route.post("/comment/delete", "CommentsController.delete");
Route.get("/comment/search", "Comments/ShowController.search");
Route.get("/comment/:id", "Comments/ShowController.findById");
Route.get("/comment/findByPostId", "Comments/ShowController.findByPostId");
Route.get("/comment/findByUserId", "Comments/ShowController.findByUserId");
Route.get("/comment/totalComments", "Comments/ShowController.totalComments");