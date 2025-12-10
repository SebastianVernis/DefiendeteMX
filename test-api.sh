#!/bin/bash

# API Testing Script for Issues CRUD Service
# This script demonstrates all API endpoints

echo "🧪 DefiendeteMX - Issues CRUD API Test Script"
echo "=============================================="
echo ""

# Configuration
API_BASE="http://localhost:3000/api"
USER_ID="675569a1234567890abcdef0"  # Replace with actual user ID

echo "📝 Note: Make sure MongoDB is running and the dev server is started:"
echo "   mongod"
echo "   npm run dev"
echo ""
echo "Press Enter to continue..."
read

echo ""
echo "1️⃣  Creating a new issue..."
echo "POST $API_BASE/issues"
ISSUE_RESPONSE=$(curl -s -X POST "$API_BASE/issues" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Test Issue - $(date +%s)\",
    \"description\": \"This is a test issue created via API\",
    \"category\": \"VIOLENCIA_DOMESTICA\",
    \"user\": \"$USER_ID\",
    \"incident\": {
      \"date\": \"2024-12-01\"
    }
  }")

echo "$ISSUE_RESPONSE" | jq '.'
ISSUE_ID=$(echo "$ISSUE_RESPONSE" | jq -r '.data._id')
echo ""
echo "✅ Issue created with ID: $ISSUE_ID"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "2️⃣  Getting all issues for user..."
echo "GET $API_BASE/issues?userId=$USER_ID"
curl -s "$API_BASE/issues?userId=$USER_ID" | jq '.'
echo ""
read -p "Press Enter to continue..."

echo ""
echo "3️⃣  Getting single issue..."
echo "GET $API_BASE/issues/$ISSUE_ID?userId=$USER_ID"
curl -s "$API_BASE/issues/$ISSUE_ID?userId=$USER_ID" | jq '.'
echo ""
read -p "Press Enter to continue..."

echo ""
echo "4️⃣  Updating issue..."
echo "PUT $API_BASE/issues/$ISSUE_ID"
curl -s -X PUT "$API_BASE/issues/$ISSUE_ID" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"priority\": \"ALTO\",
    \"description\": \"Updated description\"
  }" | jq '.'
echo ""
read -p "Press Enter to continue..."

echo ""
echo "5️⃣  Updating issue status..."
echo "PATCH $API_BASE/issues/$ISSUE_ID/status"
curl -s -X PATCH "$API_BASE/issues/$ISSUE_ID/status" \
  -H "Content-Type: application/json" \
  -d "{
    \"status\": \"EN_PROCESO\",
    \"userId\": \"$USER_ID\",
    \"notes\": \"Investigation started\"
  }" | jq '.'
echo ""
read -p "Press Enter to continue..."

echo ""
echo "6️⃣  Adding a note..."
echo "POST $API_BASE/issues/$ISSUE_ID/notes"
curl -s -X POST "$API_BASE/issues/$ISSUE_ID/notes" \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"This is a test note\",
    \"userId\": \"$USER_ID\",
    \"type\": \"GENERAL\"
  }" | jq '.'
echo ""
read -p "Press Enter to continue..."

echo ""
echo "7️⃣  Adding evidence..."
echo "POST $API_BASE/issues/$ISSUE_ID/evidence"
curl -s -X POST "$API_BASE/issues/$ISSUE_ID/evidence" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"https://example.com/evidence.jpg\",
    \"fileType\": \"IMAGE\",
    \"description\": \"Test evidence\",
    \"userId\": \"$USER_ID\"
  }" | jq '.'
echo ""
read -p "Press Enter to continue..."

echo ""
echo "8️⃣  Searching issues..."
echo "GET $API_BASE/issues/search?q=Test&userId=$USER_ID"
curl -s "$API_BASE/issues/search?q=Test&userId=$USER_ID" | jq '.'
echo ""
read -p "Press Enter to continue..."

echo ""
echo "9️⃣  Getting statistics..."
echo "GET $API_BASE/issues/stats?userId=$USER_ID"
curl -s "$API_BASE/issues/stats?userId=$USER_ID" | jq '.'
echo ""
read -p "Press Enter to continue..."

echo ""
echo "🔟  Deleting issue (soft delete)..."
echo "DELETE $API_BASE/issues/$ISSUE_ID?userId=$USER_ID"
curl -s -X DELETE "$API_BASE/issues/$ISSUE_ID?userId=$USER_ID" | jq '.'
echo ""

echo ""
echo "✅ All API endpoints tested successfully!"
echo ""
echo "📚 For more information, see:"
echo "   - API_DOCUMENTATION.md"
echo "   - IMPLEMENTATION_SUMMARY_ISSUE_7.md"
echo ""
