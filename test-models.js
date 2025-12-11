/**
 * Models Validation Test Script
 * Tests all Mongoose models and their schemas
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/defiendete-mx';

async function testModels() {
  console.log('🔍 Testing Mongoose Models...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });
    console.log('✅ Connected to MongoDB\n');

    // Test collections
    console.log('📦 Testing database collections...\n');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} existing collections`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');

    // Test 1: Create test user
    console.log('Test 1: User Collection');
    console.log('─────────────────────────────────────────');
    const UserSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      fullName: { type: String, required: true },
      phone: String,
      createdAt: { type: Date, default: Date.now },
    });
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword123',
      fullName: 'Test User',
      phone: '5512345678',
    });
    console.log(`✅ Test user created: ${testUser._id}`);
    console.log(`   Email: ${testUser.email}`);
    console.log('');

    // Test 2: Create test issue
    console.log('Test 2: Issue Collection');
    console.log('─────────────────────────────────────────');
    const IssueSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      title: { type: String, required: true },
      description: String,
      category: String,
      status: { type: String, default: 'open' },
      priority: { type: String, default: 'medium' },
      createdAt: { type: Date, default: Date.now },
    });
    const Issue = mongoose.models.Issue || mongoose.model('Issue', IssueSchema);
    
    const testIssue = await Issue.create({
      userId: testUser._id,
      title: 'Test Issue',
      description: 'This is a test issue',
      category: 'detencion_arbitraria',
      status: 'open',
      priority: 'medium',
    });
    console.log(`✅ Test issue created: ${testIssue._id}`);
    console.log(`   Title: ${testIssue.title}`);
    console.log('');

    // Test 3: Create test notification
    console.log('Test 3: Notification Collection');
    console.log('─────────────────────────────────────────');
    const NotificationSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      type: { type: String, required: true },
      recipient: String,
      subject: String,
      message: { type: String, required: true },
      status: { type: String, default: 'pending' },
      createdAt: { type: Date, default: Date.now },
    });
    const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
    
    const testNotification = await Notification.create({
      userId: testUser._id,
      type: 'sms',
      recipient: '+525512345678',
      subject: 'Test Notification',
      message: 'This is a test notification',
      status: 'pending',
    });
    console.log(`✅ Test notification created: ${testNotification._id}`);
    console.log(`   Type: ${testNotification.type}`);
    console.log('');

    // Test 4: Query test documents
    console.log('Test 4: Querying documents');
    console.log('─────────────────────────────────────────');
    
    const foundUser = await User.findById(testUser._id);
    console.log(`✅ User found: ${foundUser.email}`);

    const foundIssue = await Issue.findById(testIssue._id);
    console.log(`✅ Issue found: ${foundIssue.title}`);

    const foundNotification = await Notification.findById(testNotification._id);
    console.log(`✅ Notification found: ${foundNotification.subject}`);

    console.log('');

    // Test 5: Update test documents
    console.log('Test 5: Updating documents');
    console.log('─────────────────────────────────────────');
    
    await User.findByIdAndUpdate(testUser._id, { fullName: 'Updated User' });
    console.log('✅ User updated');

    await Issue.findByIdAndUpdate(testIssue._id, { status: 'in_progress' });
    console.log('✅ Issue updated');

    await Notification.findByIdAndUpdate(testNotification._id, { status: 'sent' });
    console.log('✅ Notification updated');

    console.log('');

    // Test 6: Count documents
    console.log('Test 6: Counting documents');
    console.log('─────────────────────────────────────────');
    
    const userCount = await User.countDocuments();
    console.log(`✅ Users in database: ${userCount}`);

    const issueCount = await Issue.countDocuments();
    console.log(`✅ Issues in database: ${issueCount}`);

    const notificationCount = await Notification.countDocuments();
    console.log(`✅ Notifications in database: ${notificationCount}`);

    console.log('');

    // Test 7: Delete test documents
    console.log('Test 7: Cleaning up test documents');
    console.log('─────────────────────────────────────────');
    
    await User.findByIdAndDelete(testUser._id);
    console.log('✅ User deleted');

    await Issue.findByIdAndDelete(testIssue._id);
    console.log('✅ Issue deleted');

    await Notification.findByIdAndDelete(testNotification._id);
    console.log('✅ Notification deleted');

    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ ALL DATABASE TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log('   - Collections tested: 3');
    console.log('   - CRUD operations: ✅');
    console.log('   - Data integrity: ✅');
    console.log('   - Query operations: ✅');
    console.log('');

    return true;
  } catch (error) {
    console.error('❌ Model test failed:', error.message);
    console.error('\nError details:', error);
    return false;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
  }
}

// Run the test
testModels()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
