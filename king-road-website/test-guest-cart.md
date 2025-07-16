# Guest Cart Flow Testing Guide

## 🧪 **Testing the Complete Guest Cart Flow**

### **1. Add Item to Cart (Guest)**

**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/cart/add \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }' \
  --cookie-jar cookies.txt
```

**Expected Response:**
```json
{
  "status": 1,
  "message": "The data was created successfully.",
  "data": {
    "id": "cart_unique_id",
    "product_id": 1,
    "quantity": 2,
    "price": 980.00,
    "total": 1960.00,
    "product": {
      "id": 1,
      "name_en": "Dashboard Shell 88-97 Gray New",
      "name_ar": "قشرة طبلون 88-97 لون رمادي جديد",
      "current_price": 980.00,
      "featured_image": "/assets/images/product/1.jpg",
      "is_in_stock": true
    }
  }
}
```

### **2. Get Cart Count (Guest)**

**Request:**
```bash
curl -X GET http://localhost:8000/api/v1/cart/count \
  -H "Accept: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  --cookie cookies.txt
```

**Expected Response:**
```json
{
  "status": 1,
  "message": "The data was retrieved successfully.",
  "data": {
    "count": 2
  }
}
```

### **3. Get Cart Items (Guest)**

**Request:**
```bash
curl -X GET http://localhost:8000/api/v1/cart \
  -H "Accept: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  --cookie cookies.txt
```

**Expected Response:**
```json
{
  "status": 1,
  "message": "The data was retrieved successfully.",
  "data": [
    {
      "id": "cart_unique_id",
      "product_id": 1,
      "quantity": 2,
      "price": 980.00,
      "total": 1960.00,
      "product": {
        "id": 1,
        "name_en": "Dashboard Shell 88-97 Gray New",
        "name_ar": "قشرة طبلون 88-97 لون رمادي جديد",
        "current_price": 980.00,
        "featured_image": "/assets/images/product/1.jpg",
        "is_in_stock": true
      }
    }
  ]
}
```

### **4. Update Cart Item Quantity (Guest)**

**Request:**
```bash
curl -X PUT http://localhost:8000/api/v1/cart/update/cart_unique_id \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{
    "quantity": 3
  }' \
  --cookie cookies.txt
```

**Expected Response:**
```json
{
  "status": 1,
  "message": "The data was updated successfully.",
  "data": {
    "id": "cart_unique_id",
    "product_id": 1,
    "quantity": 3,
    "price": 980.00,
    "total": 2940.00,
    "product": {
      "id": 1,
      "name_en": "Dashboard Shell 88-97 Gray New",
      "current_price": 980.00
    }
  }
}
```

### **5. Get Cart Total (Guest)**

**Request:**
```bash
curl -X GET http://localhost:8000/api/v1/cart/total \
  -H "Accept: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  --cookie cookies.txt
```

**Expected Response:**
```json
{
  "status": 1,
  "message": "The data was retrieved successfully.",
  "data": {
    "subtotal": 2940.00,
    "item_count": 3,
    "total": 2940.00
  }
}
```

### **6. Remove Item from Cart (Guest)**

**Request:**
```bash
curl -X DELETE http://localhost:8000/api/v1/cart/remove/cart_unique_id \
  -H "Accept: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  --cookie cookies.txt
```

**Expected Response:**
```json
{
  "status": 1,
  "message": "The data was deleted successfully.",
  "data": null
}
```

### **7. Verify Cart is Empty After Removal**

**Request:**
```bash
curl -X GET http://localhost:8000/api/v1/cart/count \
  -H "Accept: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  --cookie cookies.txt
```

**Expected Response:**
```json
{
  "status": 1,
  "message": "The data was retrieved successfully.",
  "data": {
    "count": 0
  }
}
```

## 🔍 **Debugging Steps**

### **Check Laravel Logs:**
```bash
cd king-road-api
tail -f storage/logs/laravel.log
```

### **Check Session Files:**
```bash
ls -la storage/framework/sessions/
```

### **Test Session Persistence:**
```bash
# Add item
curl -X POST http://localhost:8000/api/v1/cart/add \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 1}' \
  --cookie-jar test-cookies.txt

# Check count (should be 1)
curl -X GET http://localhost:8000/api/v1/cart/count \
  --cookie test-cookies.txt

# Check count again (should still be 1)
curl -X GET http://localhost:8000/api/v1/cart/count \
  --cookie test-cookies.txt
```

## 🚀 **Frontend Testing**

### **Test in Browser Console:**
```javascript
// Add item to cart
fetch('/api/v1/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    product_id: 1,
    quantity: 2
  })
}).then(r => r.json()).then(console.log);

// Get cart count
fetch('/api/v1/cart/count', {
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}).then(r => r.json()).then(console.log);

// Get cart items
fetch('/api/v1/cart', {
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}).then(r => r.json()).then(console.log);
```

## ✅ **Success Indicators**

1. **Session Persistence**: Cart count remains the same across requests
2. **Proper Logging**: Laravel logs show session operations
3. **Correct Responses**: All endpoints return expected JSON structure
4. **Frontend Integration**: React app shows correct cart count and items
5. **Session Files**: Session files are created in `storage/framework/sessions/`

## 🔧 **Common Issues & Solutions**

### **Issue: Cart always returns 0**
- **Solution**: Check session middleware is applied to cart routes
- **Check**: Session files are being created
- **Verify**: CORS settings allow credentials

### **Issue: Session not persisting**
- **Solution**: Ensure `withCredentials: true` in axios
- **Check**: Session driver is set to 'file'
- **Verify**: Session cookies are being sent

### **Issue: CSRF errors**
- **Solution**: API routes are excluded from CSRF in `VerifyCsrfToken.php`
- **Check**: `api/*` is in the `$except` array