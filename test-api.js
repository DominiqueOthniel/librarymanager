const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 Testing Library Manager API...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test books endpoint
    const booksResponse = await axios.get('http://localhost:5000/api/books');
    console.log('✅ Books endpoint:', booksResponse.data.length, 'books found');
    
    // Test categories endpoint
    const categoriesResponse = await axios.get('http://localhost:5000/api/books/categories/list');
    console.log('✅ Categories endpoint:', categoriesResponse.data.length, 'categories found');
    
    console.log('🎉 All API tests passed! Your backend is working correctly.');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('Make sure the backend server is running on port 5000');
  }
}

testAPI();



