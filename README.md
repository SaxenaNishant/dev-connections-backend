# DEV CONNECTIONS BACKEND

    - NGINX CONFIGURATION

        - sudo nano /etc/nginx/nginx.conf
        - Update configurations :
        server_name 13.61.146.203; # Your server's public IP or domain
        location /api/ {
            proxy_pass http://localhost:8000/; # Forward requests to Node.js
            proxy_http_version 1.1;          # Use HTTP/1.1 for compatibility
            proxy_set_header Upgrade $http_upgrade;  # Support WebSocket connections
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
