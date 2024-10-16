#Buka file konfigurasi Nginx: 
sudo nano /etc/nginx/sites-available/default

#Configurasi file nya dengan yang berada di file default
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name 40.82.192.42;  # IP address Anda

    ssl_certificate /etc/ssl/certs/selfsigned.crt;  # Path ke sertifikat self-signed
    ssl_certificate_key /etc/ssl/private/selfsigned.key;  # Path ke private key

    location /jovanfidello {
        proxy_pass http://localhost:3000;  # Aplikasi Express Anda
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Jika ingin mengarahkan semua permintaan ke /jovanfidello
    location / {
        return 301 /jovanfidello;  # Redirect ke subdomain
    }
}

#Restart nginx
sudo systemctl restart nginx
