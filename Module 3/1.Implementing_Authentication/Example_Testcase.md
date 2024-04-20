- **Endpoint**: POST /users
- **Headers**: Content-Type: application/json
- **Request Body**: { "username": "johndoe", "email": "john@example.com" }
- **Expected Success Response**: HTTP 201 (Created), Body includes user ID and default values.
- **Test Scenarios**:
  1. **Valid Request**: Send a valid user creation request and expect a 201 response with the correct user data.
  2. **Missing Data**: Omit required fields like `username` and expect a 400 response with an error message.
  3. **Invalid Email Format**: Send an invalid email format and expect a 400 response with an error message.
  4. **SQL Injection**: Try to inject SQL through input fields and ensure the input is sanitized appropriately.
  5. **Authentication Required**: Try to create a user without proper authentication and expect a 401/403 response.
