cd backend;npm i;
npx prisma migrate dev;
cd src;node server.js
dont forget to set cors url to frontend url
copy over .env.example to .env file
add your db connection string in schema.prisma

