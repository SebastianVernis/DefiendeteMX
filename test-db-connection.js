/**
 * Database Connection Test Script
 * Tests MongoDB connection and basic operations
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/defiendete-mx';

async function testDatabaseConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  console.log(`📍 Connection URI: ${MONGODB_URI}\n`);

  try {
    // Test 1: Connect to MongoDB
    console.log('Test 1: Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });
    console.log('✅ Connected successfully\n');

    // Test 2: Check connection state
    console.log('Test 2: Checking connection state...');
    const state = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    console.log(`✅ Connection state: ${states[state]}\n`);

    // Test 3: Get database info
    console.log('Test 3: Getting database info...');
    const dbName = mongoose.connection.name;
    console.log(`✅ Database name: ${dbName}\n`);

    // Test 4: List collections
    console.log('Test 4: Listing collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections:`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');

    // Test 5: Create a test document
    console.log('Test 5: Creating test document...');
    const TestSchema = new mongoose.Schema({
      name: String,
      timestamp: Date,
    });
    const TestModel = mongoose.model('Test', TestSchema);
    
    const testDoc = await TestModel.create({
      name: 'Connection Test',
      timestamp: new Date(),
    });
    console.log(`✅ Test document created with ID: ${testDoc._id}\n`);

    // Test 6: Read the test document
    console.log('Test 6: Reading test document...');
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log(`✅ Document found: ${foundDoc.name}\n`);

    // Test 7: Delete the test document
    console.log('Test 7: Deleting test document...');
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('✅ Test document deleted\n');

    // Test 8: Check database stats
    console.log('Test 8: Getting database statistics...');
    const stats = await mongoose.connection.db.stats();
    console.log(`✅ Database stats:`);
    console.log(`   - Collections: ${stats.collections}`);
    console.log(`   - Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`   - Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
    console.log(`   - Indexes: ${stats.indexes}`);
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ ALL DATABASE TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════\n');

    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('\nError details:', error);
    return false;
  } finally {
    // Cleanup
    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
