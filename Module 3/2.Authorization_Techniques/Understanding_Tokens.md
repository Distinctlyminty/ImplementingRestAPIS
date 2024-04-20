# Authentication Token in the Application

In this application, we use JSON Web Tokens (JWT) for authentication. JWT is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted.

## Generating the Token

The token is generated in the `/oauth2/v2.0/token` endpoint. When a GET request is made to this endpoint, a new token is created with the following payload:

```javascript


const

 payload = {
  sub: "1234567890",
  name: "John Doe",
  roles: ["admin"], // User roles
  permissions: [ // User permissions
    { resource: 'course', action: 'create' },
    { resource: 'course', action: 'read' },
    { resource: 'course', action: 'update' },
    { resource: 'course', action: 'delete' },
    // Add more permissions as needed
  ],
  iat: Math.floor(Date.now() / 1000), // Issued at
  exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
  aud: "8d3370fd-59e6-47d0-8cc6-a04f95fe7908", // Audience
  iss: "https://sts.windows.net/fe393fd2-baf4-4426-af97-2aa7578a31f2/", // Issuer
};
```

The `sub` field is the subject of the token (usually the user ID), `name` is the name of the user, `roles` is an array of the user's roles, and `permissions` is an array of the user's permissions. Each permission is an object with `resource` and `action` properties. The `iat` field is the time the token was issued, and `exp` is the time the token will expire. The `aud` field is the audience of the token, and `iss` is the issuer of the token.

The token is then signed with a secret key and returned in the response:

```javascript
const token = jwt.sign(payload, secretKey);
res.json({
  access_token: token,
  token_type: "Bearer",
  expires_in: 3600,
});
```

## Using the Token

The client should include the token in the `Authorization` header of each request:

```
Authorization: Bearer <token>
```

The server can then verify the token, extract the payload, and use the `roles` and `permissions` fields to implement role-based and resource-based access control.