// This code is for viewing purposes only. Not licensed for reuse or distribution.

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

connectDB()
  .then((conn) => {
    console.log('DB connection successful!');
    console.log(conn.connection.name, conn.connection.host);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    server.close(() => process.exit(1));
  });
