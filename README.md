# URL Shortener API

A simple URL Shortener REST API using Node.js and Express, storing data in a JSON file.

## Install
1. `npm install`

## Run
- Dev: `npm run dev` (requires nodemon)
- Prod: `npm start`

Server default di `http://localhost:3000`

## Endpoints
- `POST /shorten` - Create short URL (body: { url })
- `GET /urls` - Get all short URLs
- `GET /:code` - Redirect to original URL
- `DELETE /urls/:code` - Delete short URL

## Contoh curl
- Create short URL:
  ```bash
  curl -X POST http://localhost:3000/shorten \
    -H "Content-Type: application/json" \
    -d '{"url":"https://google.com"}'
  ```

- Get all URLs:
  ```bash
  curl http://localhost:3000/urls
  ```

- Redirect (open in browser):
  ```
  http://localhost:3000/aB3kL9
  ```

- Delete URL:
  ```bash
  curl -X DELETE http://localhost:3000/urls/aB3kL9
  ```
