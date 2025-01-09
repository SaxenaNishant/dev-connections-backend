# DevTinder APIs

## authRouter

- POST /api/v1/signup
- POST /api/v1/login
- POST /api/v1/logout

## profileRouter

- GET /api/v1/profile/view
- PATCH /api/v1/profile/edit
- PATCH /api/v1/profile/pasword

## connectionRequestRouter

- POST /api/v1/request/send/:status/:userId
- POST /api/v1/request/review/:status/:requestId

## userRouter

- GET /api/v1/user/conenctions
- GET /api/v1/user/requests/received
- GET /api/v1/user/feed - Gets you the profiles of other users on platform

- STATUS: ignore, interested, accepted, rejected
