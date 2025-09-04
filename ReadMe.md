# TikTok Excel Uploader

A modern React-based web application for uploading Excel files with a beautiful Material UI interface.

## Features

- 📁 Excel file upload (.xlsx, .xls)
- 🎨 Modern Material UI design
- 📊 Real-time upload progress
- 🔄 Processing status indicator
- 📱 Responsive design
- 🚀 Fast build with Vite
- 🐳 Docker containerization

## Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

1. **Build and run with docker-compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open https://ticktokbackend-production-df37.up.railway.app in your browser

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. **Build the Docker image:**
   ```bash
   docker build -t tiktok-excel-uploader .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:80 tiktok-excel-uploader
   ```

3. **Access the application:**
   - Open https://ticktokbackend-production-df37.up.railway.app in your browser

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## API Configuration

The application is configured to connect to:
- **Upload endpoint:** `https://ticktokbackend-production-df37.up.railway.app/api/upload-excel`
- **Backend port:** 3000

To change the API endpoint, update the URL in `src/FileUpload.jsx`.

## Docker Configuration

### Files
- `Dockerfile` - Multi-stage build with Node.js and nginx
- `docker-compose.yml` - Orchestration for easy deployment
- `nginx.conf` - Custom nginx configuration for SPA routing
- `.dockerignore` - Excludes unnecessary files from build

### Environment Variables
- `NODE_ENV=production` - Set in docker-compose.yml

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 3000
   netstat -ano | findstr :3000
   
   # Kill the process or change port in docker-compose.yml
   ```

2. **Build fails:**
   ```bash
   # Clean and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

3. **Routing issues:**
   - Ensure nginx.conf is properly copied in Dockerfile
   - Check that `try_files $uri $uri/ /index.html;` is in nginx config

### Logs
```bash
# View container logs
docker-compose logs tiktok-excel-uploader

# Follow logs in real-time
docker-compose logs -f tiktok-excel-uploader
```

## Production Deployment

### Using Docker Compose
```bash
# Production build
docker-compose -f docker-compose.yml up -d --build

# Scale if needed
docker-compose up -d --scale tiktok-excel-uploader=3
```

### Using Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml tiktok-excel-uploader
```

## Security

- Custom nginx configuration with security headers
- Gzip compression enabled
- Static asset caching
- XSS protection headers

## License

MIT License 