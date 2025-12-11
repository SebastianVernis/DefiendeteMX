# ⚡ Quick Commands - Defiéndete MX

Comandos rápidos para testing, deployment y troubleshooting.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- __tests__/lib/auth/jwt.test.js

# Run tests with coverage
npm test -- --coverage

# Clear Jest cache
npm test -- --clearCache
```

---

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build

# Start production server
npm run start

# Lint code (if configured)
npm run lint
```

---

## 🗄️ Database Setup

### MongoDB Local
```bash
# Install MongoDB (Mac)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# Connect with Mongosh
mongosh "mongodb://localhost:27017/defiendete-mx"

# Create database
use defiendete-mx

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.issues.createIndex({ user: 1, createdAt: -1 })
```

### MongoDB Atlas
```bash
# Connection string format
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/defiendete-mx?retryWrites=true&w=majority

# Test connection
mongosh "your-connection-string-here"
```

### Cloudflare D1
```bash
# Login to Cloudflare
npx wrangler login

# Create D1 database
npx wrangler d1 create defiendete-mx-prod

# Execute migrations
npx wrangler d1 execute defiendete-mx-prod --file=./migrations/d1-schema.sql

# Query database
npx wrangler d1 execute defiendete-mx-prod --command="SELECT COUNT(*) FROM users"

# List databases
npx wrangler d1 list
```

---

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Add environment variable
vercel env add MONGODB_URI production

# Pull environment variables
vercel env pull .env.local

# List deployments
vercel ls

# Remove deployment
vercel rm <deployment-url>
```

### Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Build for Cloudflare
npx @cloudflare/next-on-pages@1

# Deploy
wrangler pages publish .vercel/output/static

# Add secret
echo "your-secret" | wrangler secret put JWT_SECRET

# List deployments
wrangler pages deployment list

# Tail logs
wrangler pages deployment tail
```

### Docker

```bash
# Build image
docker build -t defiendete-mx .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI="mongodb://..." \
  -e JWT_SECRET="..." \
  defiendete-mx

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 🔐 Security & Secrets

### Generate Secrets

```bash
# Generate JWT secret (32 bytes)
openssl rand -base64 32

# Generate JWT refresh secret (32 bytes)
openssl rand -base64 32

# Generate random UUID
uuidgen

# Generate random string (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Hash Passwords

```bash
# Install bcryptjs globally (optional)
npm install -g bcryptjs

# Hash password (Node.js)
node -e "console.log(require('bcryptjs').hashSync('YourPassword123!', 10))"
```

---

## 📊 Database Operations

### MongoDB

```bash
# Export database
mongodump --uri="mongodb://localhost:27017/defiendete-mx" --out=./backup

# Import database
mongorestore --uri="mongodb://localhost:27017/defiendete-mx" ./backup

# Export collection to JSON
mongoexport --uri="mongodb://localhost:27017/defiendete-mx" --collection=users --out=users.json

# Import JSON
mongoimport --uri="mongodb://localhost:27017/defiendete-mx" --collection=users --file=users.json

# Drop database
mongosh "mongodb://localhost:27017" --eval "use defiendete-mx; db.dropDatabase()"

# Count documents
mongosh "mongodb://localhost:27017/defiendete-mx" --eval "db.users.countDocuments()"
```

### D1 (Cloudflare)

```bash
# Backup database
npx wrangler d1 backup create defiendete-mx-prod

# List backups
npx wrangler d1 backup list defiendete-mx-prod

# Restore from backup
npx wrangler d1 backup restore defiendete-mx-prod <backup-id>

# Export data
npx wrangler d1 execute defiendete-mx-prod --command="SELECT * FROM users" --json > users.json

# Count records
npx wrangler d1 execute defiendete-mx-prod --command="SELECT COUNT(*) as count FROM users"
```

---

## 🐛 Debugging

### Check Environment

```bash
# Verify Node version
node --version
# Should be v22.x

# Verify npm version
npm --version

# Check environment variables
printenv | grep -E 'MONGODB_URI|JWT_SECRET|TWILIO'

# List installed packages
npm list --depth=0

# Check outdated packages
npm outdated

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Build Debugging

```bash
# Clean build cache
rm -rf .next node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Build with verbose logging
npm run build -- --debug

# Build with specific Node options
NODE_OPTIONS='--max-old-space-size=4096' npm run build
```

### Runtime Debugging

```bash
# Start with Node debugger
node --inspect ./node_modules/.bin/next dev

# Start with verbose logging
DEBUG=* npm run dev

# Check what's running on port 3000
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

---

## 🧹 Cleanup

```bash
# Clean build artifacts
rm -rf .next out

# Clean dependencies
rm -rf node_modules

# Clean all (including lock file)
rm -rf node_modules package-lock.json .next out

# Clean Jest cache
npm test -- --clearCache

# Clean Vercel cache
vercel --force

# Full reset
git clean -fdx
npm install
```

---

## 📡 API Testing

### Using curl

```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }' \
  -c cookies.txt

# Get user info (with auth)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create issue
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Issue",
    "description": "Test description",
    "category": "OTRO"
  }'

# Send SMS
curl -X POST http://localhost:3000/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "phoneNumber": "+52XXXXXXXXXX",
    "message": "Test message"
  }'
```

### Using httpie (prettier output)

```bash
# Install httpie
brew install httpie  # Mac
# or
pip install httpie   # Python

# Register
http POST localhost:3000/api/auth/register \
  email=test@example.com \
  password=TestPass123! \
  fullName="Test User"

# Login
http POST localhost:3000/api/auth/login \
  email=test@example.com \
  password=TestPass123!

# Get with auth
http localhost:3000/api/auth/me \
  Authorization:"Bearer YOUR_JWT_TOKEN"
```

---

## 🔍 Monitoring

### Logs

```bash
# View Vercel logs
vercel logs

# Stream logs
vercel logs --follow

# View logs for specific deployment
vercel logs <deployment-url>

# View Cloudflare logs
wrangler tail

# View Docker logs
docker-compose logs -f app

# View PM2 logs (if using PM2)
pm2 logs defiendete-mx
```

### Performance

```bash
# Analyze bundle size
npm run build -- --profile

# Check bundle composition
npx @next/bundle-analyzer

# Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Check page speed
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000

# Network analysis
curl -w "Time Connect: %{time_connect}s\nTime Start Transfer: %{time_starttransfer}s\nTime Total: %{time_total}s\n" -o /dev/null -s http://localhost:3000
```

---

## 🔄 Git Operations

```bash
# Commit changes
git add .
git commit -m "feat: description"
git push

# Create branch
git checkout -b feature/new-feature

# Update from main
git checkout main
git pull
git checkout feature/new-feature
git merge main

# Reset to last commit
git reset --hard HEAD

# View changes
git status
git diff

# View commit history
git log --oneline --graph --decorate

# Stash changes
git stash
git stash pop
```

---

## 📦 Package Management

```bash
# Update specific package
npm update <package-name>

# Update all packages
npm update

# Install specific version
npm install <package-name>@<version>

# Uninstall package
npm uninstall <package-name>

# Check package info
npm info <package-name>

# Search packages
npm search <keyword>

# List global packages
npm list -g --depth=0

# Clear npm cache
npm cache clean --force
```

---

## 🛠️ Troubleshooting Commands

### Port Issues

```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 $(lsof -t -i:3000)

# Or use npx kill-port
npx kill-port 3000
```

### Module Issues

```bash
# Rebuild node modules
npm rebuild

# Clear module cache
rm -rf node_modules/.cache

# Reinstall with legacy peer deps
npm install --legacy-peer-deps

# Force reinstall
npm ci
```

### SSL/Certificate Issues

```bash
# Disable SSL verification (dev only)
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Update certificates (Mac)
brew install ca-certificates
brew upgrade ca-certificates

# Check certificate
openssl s_client -connect example.com:443
```

---

## 🎯 Quick Fixes

### Fix Runtime Errors

```bash
# Add runtime config to API routes
find app/api -name "route.js" -exec sh -c 'echo "export const runtime = '\''nodejs'\'';\n$(cat {})" > {}' \;

# Or manually add to each route.js:
# export const runtime = 'nodejs';
```

### Fix Missing Dependencies

```bash
# Install all missing
npm install @cloudflare/next-on-pages bcrypt --save-dev

# Or use bcryptjs instead
npm install bcryptjs --save
```

### Reset Everything

```bash
# Nuclear option - reset everything
rm -rf node_modules .next out package-lock.json
npm cache clean --force
npm install
npm run build
```

---

## 📚 Documentation

```bash
# Generate API docs (if swagger configured)
npm run docs

# View README in terminal
cat README.md

# Search in documentation
grep -r "search-term" *.md

# Count lines of code
find app -name "*.js" | xargs wc -l
```

---

## 💡 Pro Tips

```bash
# Create alias for common commands (add to .bashrc or .zshrc)
alias dev='npm run dev'
alias build='npm run build'
alias test='npm test'
alias deploy='vercel --prod'

# Use npm scripts with --
npm run build -- --profile

# Run multiple commands
npm install && npm run build && npm test

# Background process
npm run dev > dev.log 2>&1 &

# Monitor file changes
watch -n 1 'ls -la .next/'
```

---

**Última actualización:** 2025-12-11
