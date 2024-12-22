##เริ่มต้นด้วยภาพเบสของ Node.js
FROM node:14

##ตั้ง working directory ภายใน container
WORKDIR /app

##คัดลอก package.json และ package-lock.json ไปยัง working directory
COPY package*.json ./

#ติดตั้ง dependencies
RUN npm install

#คัดลอกโค้ดของโปรเจคทั้งหมดไปยัง working directory
COPY . .

#เปิดพอร์ตที่แอพจะรัน
EXPOSE 3000

#คำสั่งในการรันแอพ
CMD ["node", "server.js"]