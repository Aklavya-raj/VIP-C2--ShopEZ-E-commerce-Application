# ShopEZ - Premium E-Commerce Application

ShopEZ is a full-stack e-commerce application built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides a premium shopping experience with a modern user interface and robust backend architecture.

## Features

- **Modern User Interface**: Built with React and Vite for fast development and optimized production builds.
- **Responsive Design**: Designed to work seamlessly across various devices and screen sizes.
- **RESTful API**: A robust backend API built with Express.js and Node.js.
- **Database Integration**: Utilizes MongoDB for flexible and scalable data storage.
- **Authentication**: Secure user authentication (including Google OAuth support).

## Project Structure

The project is structured as a monorepo containing both the client and server applications:

- `client/`: Contains the React frontend application built with Vite.
- `server/`: Contains the Node.js/Express backend application.

## Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (running locally or a connection string for MongoDB Atlas)

## Installation

To install dependencies for both the client and server applications, you can use the provided script from the root directory:

```bash
npm run install-all
```

Alternatively, you can install them separately:

```bash
cd client
npm install
cd ../server
npm install
```

## Usage

You can start both the client and server development environments concurrently from the root directory:

```bash
npm run dev
```

### Running Separately

To run the server individually:
```bash
npm run server
```
*or*
```bash
cd server
npm run dev
```

To run the client individually:
```bash
npm run client
```
*or*
```bash
cd client
npm run dev
```

## Database Seeding

To populate the database with initial data, you can run the seed script:

```bash
npm run seed
```

## Technologies Used

**Frontend (Client)**:
- React
- Vite
- React Router DOM
- Axios
- Chart.js / React-Chartjs-2
- @react-oauth/google

**Backend (Server)**:
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs
- cors
- dotenv

## License

This project is licensed under the MIT License.
