# Deployment Steps

    - AWS signup
    - Launch EC2 instance
    - chmod 400<secret>.pem (made our .pem file secrets file only available for read for current user and not for viewing for other not for write and executed file for anyone)
    - ssh -i "dev-connections-secrets.pem" ec2-user@ec2-13-61-146-203.eu-north-1.compute.amazonaws.com (connect with the virtual machine created using ec2 instance using ssh command)

    - Install node version 20.13.1 (using nvm) :
        - curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
        - nvm install 20.13.1
        - node -v

    - Git clone frontend and backend repositories

    - Frontend
        - npm install -----> Dependencies installed
        - npm run build
        - sudo yum update
        - sudo yum install nginx
        - sudo systemctl start nginx
        - sudo systemctl enable nginx
        - Copy code from dist folder(build files) of frontend repo to /usr/share/nginx/html/
        - sudo scp -r dist/* /usr/share/nginx/html/
        - Enable port 80 of your instance (Whitelistig port or open port 80 on ec2 instance)

    - Backend
        - npm install -----> Dependencies installed
        - Allowed ec2 instane public ip on mongodb server (Whitelisting IPs address)
        - npm install pm2 -g
        - pm2 start -name "dev-connections" -- start
        - pm2 logs
        - pm2 list, pm2 flush <name>, pm2 stop <name>, pm2 delete <name>
        - NGINX CONFIGURATION (For converting "13.61.146.203:8000" to "13.61.146.203/api") :
            - sudo nano /etc/nginx/nginx.conf
            - Update configurations :
                server_name 13.61.146.203;
                location /api/ {
                    proxy_pass http://localhost:8000/; # Forward requests to Node.js
                    proxy_http_version 1.1;          # Use HTTP/1.1 for compatibility
                    proxy_set_header Upgrade $http_upgrade;  # Support WebSocket connections
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
                }
        - Restart nginx - sudo systemctl restart nginx

    - Modifiy BASE_URL from "http://localhost:8000" to "/api" on FRONTEND project
    - Change and Update prefix of all the apis on BACKEND project from "/ap1/v1/" to "/"
    - Commit and push code from both repositories
    - Start nginx again
    - Pull the updated code on virtual machine
    - Again build the frontend code
    - Copy and replace code from dist folder to nginx location on frontend project
    - On backend project run node server using pm2 command (pm2 start npm -- start)
    - Project will be up and Running

----------------------------------------------END---------------------------------------------------------------------------
