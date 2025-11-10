# DevTinder APIs

## Auth

- POST /signup
- POST /login
- POST /logout

## Profile

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## Connection Request

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## User

- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignored, interested, accepeted, rejected
