# King Road Spare Parts API

A comprehensive Laravel API backend for the King Road e-commerce platform specializing in car spare parts.

## Features

### 🔐 Authentication & Authorization
- **User Authentication**: JWT-based authentication for customers
- **Admin Authentication**: Separate JWT authentication for admin users
- **Role-Based Access Control**: Super Admin, Admin, Moderator, and Viewer roles
- **Permission System**: Granular permissions for different resources

### 🛍️ E-commerce Core
- **Product Management**: Complete CRUD operations with categories, inventory tracking
- **Order Management**: Full order lifecycle from creation to delivery
- **Shopping Cart**: Add, update, remove items with real-time inventory checks
- **Customer Management**: User profiles, addresses, order history

### 📊 Admin Dashboard
- **Analytics**: Sales, products, customers, and revenue analytics
- **Inventory Management**: Stock tracking, low stock alerts
- **Order Processing**: Status updates, tracking, notifications
- **Customer Support**: Customer management and communication

### 🌐 Internationalization
- **Bilingual Support**: Arabic and English content
- **Localized Responses**: API responses adapt to user language preference
- **RTL Support**: Right-to-left text support for Arabic

### 🔧 Advanced Features
- **Search & Filtering**: Advanced product search with multiple filters
- **Reviews & Ratings**: Customer reviews with approval system
- **Coupons & Discounts**: Flexible coupon system
- **File Uploads**: Image management for products
- **Settings Management**: Configurable system settings

## Installation

### Prerequisites
- PHP 8.2+
- MySQL 8.0+
- Composer
- Node.js (for asset compilation)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd api
```

2. **Install dependencies**
```bash
composer install
```

3. **Environment configuration**
```bash
cp .env.example .env
```

4. **Configure database**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=king_road_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

5. **Generate application key**
```bash
php artisan key:generate
```

6. **Generate JWT secret**
```bash
php artisan jwt:secret
```

7. **Run migrations and seeders**
```bash
php artisan migrate --seed
```

8. **Create storage link**
```bash
php artisan storage:link
```

9. **Start the development server**
```bash
php artisan serve
```

## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication

#### User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "country": "United Arab Emirates",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Admin Login
```http
POST /admin/auth/login
Content-Type: application/json

{
  "email": "admin@kingroad.com",
  "password": "admin123"
}
```

### Products

#### Get Products
```http
GET /products?filter[category_id]=1&filter[search]=dashboard&sort=price
```

#### Get Single Product
```http
GET /products/{id}
```

### Orders

#### Create Order
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_phone": "1234567890",
  "customer_email": "john@example.com",
  "address_type": "house",
  "street": "Main Street",
  "house_number": "123",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

#### Get User Orders
```http
GET /orders
Authorization: Bearer {token}
```

### Admin Endpoints

#### Dashboard Stats
```http
GET /admin/dashboard/stats
Authorization: Bearer {admin_token}
```

#### Manage Products
```http
GET /admin/products
POST /admin/products
PUT /admin/products/{id}
DELETE /admin/products/{id}
Authorization: Bearer {admin_token}
```

#### Manage Orders
```http
GET /admin/orders
GET /admin/orders/{id}
POST /admin/orders/{id}/update-status
Authorization: Bearer {admin_token}
```

## Database Schema

### Key Tables

#### Users
- User authentication and profile information
- Addresses and preferences
- Order history tracking

#### Products
- Bilingual product information
- Inventory management
- Category relationships
- SEO metadata

#### Orders
- Complete order information
- Address details
- Payment and shipping status
- Order items relationship

#### Categories
- Hierarchical category structure
- Bilingual names and descriptions
- Sort ordering

#### Admins
- Admin user management
- Role-based permissions
- Activity tracking

## Configuration

### JWT Configuration
```env
JWT_SECRET=your-secret-key
JWT_TTL=60
JWT_REFRESH_TTL=20160
```

### File Storage
```env
FILESYSTEM_DISK=public
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket
```

### Email Configuration
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Security Features

### Authentication Security
- JWT token-based authentication
- Token refresh mechanism
- Password hashing with bcrypt
- Rate limiting on login attempts

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Access Control
- Role-based permissions
- Resource-level authorization
- Admin action logging
- API rate limiting

## Performance Optimization

### Database Optimization
- Proper indexing on frequently queried columns
- Eager loading for relationships
- Query optimization with Laravel Query Builder
- Database connection pooling

### Caching Strategy
- Model caching for frequently accessed data
- API response caching
- File-based caching for settings
- Redis support for session storage

### File Management
- Optimized image storage
- CDN integration support
- Automatic image resizing
- Efficient file upload handling

## Testing

### Run Tests
```bash
php artisan test
```

### Test Coverage
- Unit tests for models and services
- Feature tests for API endpoints
- Integration tests for complex workflows
- Database testing with factories

## Deployment

### Production Environment
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.kingroad.com
```

### Server Requirements
- PHP 8.2+ with required extensions
- MySQL 8.0+ or PostgreSQL 13+
- Redis for caching and sessions
- SSL certificate for HTTPS

### Deployment Steps
1. Configure production environment variables
2. Run database migrations
3. Optimize application cache
4. Set up queue workers
5. Configure web server (Nginx/Apache)
6. Set up SSL certificate
7. Configure backup system

## API Rate Limiting

### Default Limits
- Public endpoints: 60 requests per minute
- Authenticated endpoints: 120 requests per minute
- Admin endpoints: 200 requests per minute

### Custom Rate Limiting
```php
// In routes/api.php
Route::middleware(['throttle:custom'])->group(function () {
    // Custom rate limited routes
});
```

## Error Handling

### Standard Error Responses
```json
{
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  },
  "status_code": 422
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Support

### Default Admin Credentials
- **Email**: admin@kingroad.com
- **Password**: admin123

### API Documentation
- Postman collection available
- OpenAPI/Swagger documentation
- Interactive API explorer

### Contact
- **Email**: support@kingroad.com
- **Phone**: +971-XXX-XXXX
- **Website**: https://kingroad.com

## License

This project is proprietary software developed for King Road Spare Parts.