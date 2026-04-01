# Hotel Booking Application - Spring Boot

This is a complete Hotel Booking Application with a layered architecture, encompassing Authentication, Hotel & Room management, Bookings, Payments, and Notifications.

## Technology Stack
- Java 17
- Spring Boot 3.2.4
- Spring Security (JWT)
- Spring Data JPA
- MySQL
- Spring Mail

## Database Setup
1. Create a MySQL database named `hotel_booking_db`.
2. Update the credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Add a valid Gmail App Password in `application.properties` to enable email notifications.

## Sample API Requests (for Postman)

### 1. Authentication

**Register a User**
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123",
    "role": "USER"
}
```

**Verify OTP**
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
    "email": "johndoe@example.com",
    "otp": "123456" 
}
```
*(Check your email or server logs for the OTP)*

**Login (Get JWT)**
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "johndoe@example.com",
    "password": "password123"
}
```

---
*Note: For the following endpoints, add the Authorization header in Postman:*
`Authorization: Bearer <your-jwt-token>`

### 2. Hotel Management (Admin Only)

**Add Hotel**
```http
POST /api/hotels
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Grand Plaza",
    "location": "New York",
    "description": "A luxury hotel.",
    "rating": 4.5
}
```

**Search Hotels**
```http
GET /api/hotels/search?location=New York&checkIn=2024-12-01&checkOut=2024-12-05
```

### 3. Room Management (Admin Only)

**Add Room to Hotel**
```http
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
    "roomNumber": "101",
    "type": "DELUXE",
    "price": 150.0,
    "hotelId": 1
}
```

### 4. Booking Management

**Book a Room**
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
    "roomId": 1,
    "checkInDate": "2024-12-01",
    "checkOutDate": "2024-12-05"
}
```

**Get My Bookings**
```http
GET /api/bookings/my-bookings
Authorization: Bearer <token>
```

**Cancel Booking**
```http
POST /api/bookings/1/cancel
Authorization: Bearer <token>
```

### 5. Payment Management

**Process Payment**
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
    "bookingId": 1,
    "method": "CREDIT_CARD",
    "transactionId": "txn_8971239812"
}
```
