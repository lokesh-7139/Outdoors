# Outdoors - Tour Booking Application

Outdoors is a robust and scalable backend system for a modern tour booking platform. Built with Node.js, Express, and MongoDB, it provides secure RESTful APIs for managing tours, users, reviews, and bookings. The system features advanced filtering, sorting, pagination, and geospatial search to enhance tour discovery. Security is ensured through JWT authentication and role-based access control, while Nodemailer and SendGrid handle reliable email notifications. Automated background and recurring tasks are managed using both Agenda and cron jobs, making Outdoors a production-ready foundation for any travel or experience-based application.

## Table of Contents

- [Installation & Setup](#installation--setup)
- [Features](#features)
- [License](#-inspiration-only--not-for-use)
- [Contact](#contact)
- [Author](#author)
- [Acknowledgements](#acknowledgements)

## Installation & Setup

### 1. Clone the Repository

```bash

git clone https://github.com/lokesh-7139/Outdoors.git
cd Outdoors
```

### 2. Install dependencies

```bash

npm install
```

### 3. Configure Environment Variables

Create a .env file in the root directory and add your environment variables.

```env

NODE_ENV=development
PORT=3000

# MongoDB connection
DATABASE=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.mongodb.net/your-db-name?retryWrites=true&w=majority
DATABASE_PASSWORD=yourMongoDBPassword

# JWT configuration
JWT_SECRET=any_thing#you$want%%
JWT_EXPIRES_IN=10d
JWT_COOKIE_EXPIRES_IN=10
RETRY_ATTEMPTS=5

# Nodemailer SMTP
EMAIL_USERNAME=youremail@gmail.com
EMAIL_PASSWORD=your-email-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=Outdoors App <youremail@gmail.com>

# SendGrid API
SENDGRID_API_KEY=SG.xxxxxx.yyyyyyyyyyyyyyyyyyyyyy

```

### 4. Run the Server

To start the development server with auto-restart (using Nodemon):

```bash

npm run dev
```

To run the server in production mode:

```bash

npm start
```

Server will be running at: `http://localhost:3000`

## Features

- will be added later

---

## 💡 Inspiration Only — Not for Use

![License: No License](https://img.shields.io/badge/license-NO--LICENSE-red)

This project is **not licensed** for use, copying, or modification.

You are welcome to **view** the code and use it for **inspiration only**, but you are **not allowed** to:

- Copy any part of this code
- Use it in your own projects
- Share or distribute it

If you want to use any part of this project, please ask for **explicit permission**.

---

## Contact

Contact me at [lokeshkollepara3971@gmail.com](mailto:lokeshkollepara3971@gmail.com).

## Author

**[Lokesh Kollepara](https://www.linkedin.com/in/kollepara-bapiraju/)**

## Acknowledgements

- The JSON data used in this project is sourced from [Jonas Schmedtmann](https://github.com/jonasschmedtmann)’s course, ["Node.js, Express, MongoDB & More: The Complete Bootcamp"](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/).
- Full credit for the original dataset goes to him. This data is used solely for learning and non-commercial purposes.
