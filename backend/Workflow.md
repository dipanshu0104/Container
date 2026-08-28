# Api development

This API is for file uploading and hosting web app service with session based authentication.

**Importent** : This api is workes in real time.

## Functional Parts of API

API has basic **four** part as or we can say two services.

 1 ) 🔐 Authentication handling service.

 2 ) 📄 File handling service.

 3 ) 📁 Folders handling service.

 4 ) 💽 Drive handling service.


And these both services are very broad so we need to set abest folder architecture for the project.
so we are using **Monolith + Microservice** architecture.

## 🗜 Monolith + Microservice

```bash




```

### Api Endpoints

``` bash 

{ Routes and their methods for Authentication API }

Methods            Routes                              Working
____________________________________________________________________________________

GET      |  /api/auth/check-auth                   |  Check user login status
POST     |  /api/auth/signup                       |  Register a new user
POST     |  /api/auth/verify-email                 |  Verify user email using OTP
POST     |  /api/auth/login                        |  Login the user
POST     |  /api/auth/logout                       |  Logout the user (Protected)
POST     |  /api/auth/forgot-password              |  Send password reset link
POST     |  /api/auth/reset-password/:token        |  Reset password using token
GET      |  /api/auth/sessions                     |  Get all active sessions (Protected)
DELETE   |  /api/auth/sessions/:sessionId          |  Terminate specific session (Protected)
PUT      |  /api/auth/update-profile               |  Update user profile (Protected)
POST     |  /api/auth/upload-avatar                |  Upload user avatar (Protected)
____________________________________________________________________________________




{ Routes and their methods for Files API }

Methods   |  Routes                           |  Working
___________________________________________________________________________________________

GET       |  /api/files                       |  Get all user files
POST      |  /api/files/upload                |  Upload multiple files
GET       |  /api/files/preview/:id           |  Preview a file
GET       |  /api/files/download/:id          |  Download a file
PUT       |  /api/files/rename/:id            |  Rename a file
DELETE    |  /api/files/delete/:id            |  Delete a single file permanently
POST      |  /api/files/download-all          |  Download multiple selected files
POST      |  /api/files/delete-all            |  Delete multiple selected files
POST      |  /api/files/set-favorite          |  Toggle favorite status of file(s)
PATCH     |  /api/files/trash/:id             |  Toggle trash (soft delete / restore)
POST      |  /api/files/move                  |  Copy or move files to another folder
___________________________________________________________________________________________



{ Routes and their methods for Folders API }

Methods   |  Routes                        |  Working
____________________________________________________________________________________

GET       |  /api/folders                  |  Get all folders (root level)
GET       |  /api/folders/:id              |  Get specific folder contents (navigate)
POST      |  /api/folders/create           |  Create a new folder
PUT       |  /api/folders/rename/:id       |  Rename a folder
DELETE    |  /api/folders/delete/:id       |  Delete a folder
____________________________________________________________________________________



{ Routes and their methods for Drive Service API }

Methods   |  Routes                          |  Working
__________________________________________________________________________________________

GET       |  /api/drives                     |  Get all user drives
POST      |  /api/drives                     |  Create / Set a new drive
PUT       |  /api/drives/set-active/:id      |  Set a drive as active
PUT       |  /api/drives/rename/:id          |  Rename a drive
DELETE    |  /api/drives/delete/:id          |  Delete a specific drive
GET       |  /api/drives/health              |  Get drive health & storage info
__________________________________________________________________________________________

```


