# Web1.3 BE Server

Welcome to Web1.3 BE! This is a Node-Js web application designed to serve as an admin and user panel for managing various aspects of your website.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Web1.3 Server is built using Node JS, a popular JavaScript library for building server side applications. It aims to simplify the management of your website by offering a centralized server. With this app, you can perform tasks such as managing user accounts, content updates, settings, and more, all in one place.

## Installation

To get started with the Web1.3 Serve, make sure you have Node.js and npm (Node Package Manager) installed on your machine. Then, follow these steps:

1. Clone this repository to your local machine using the following command:

`git clone https://github.com/OctiLearn/WebApp1.3/tree/backend`

2. Change your working directory to the project folder:

`cd WebApp1.3`

And Checkout to "backend" branch

`git checkout backend`

3. Install the project dependencies by running:

`npm install`

## Usage

After successfully installing the dependencies, you can now run the Web1.3 Admin App locally:

`npm run dev`

This command will start a development server, and you can access the app by visiting `http://localhost:8000` in your web browser. Go to the browser, and the response 

{"msg":"Welcome to OctiLearn APIS."}

will be returned.

## Database_setup

Install pgAdmin4 GUI and postgres on your system depending upon the operating system being used.

Go to the pgAdmin4 GUI and create a database named <octilearn_dev>. 

Now that the server is up and running, the database is created execute command

`npm run migrate`

The command creates all the tables in the app, have a look at them by navigating to the path
<octilearn_dev -> Schemas -> public -> tables>.

Now open Database and navigate to the path <octilearn_dev -> Schemas>, right click on Schemas and Open PSQL tool. Copy and paste the contents of the file named <octilearn_stg.sql> and run. This will add some sample data and users to the database.

Note: Restart the server for a stable database and server connection.

## Features

The app's modular architecture allows for easy extensibility, so you can add more features as needed.

## Contributing

We welcome contributions to the Web1.3 BE! If you find any bugs, have suggestions for improvements, or want to add new features, please submit an issue or create a pull request. Your contributions help make this project better for everyone.

Before contributing, please review our [Contribution Guidelines](CONTRIBUTING.md) to understand the process.

## License

The Web1.3 Server is open-source software licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code for your purposes.

---

Thank you for using the Web1.3 BE! If you have any questions or need assistance, please don't hesitate to contact us.

Developed by https://github.com/OctiLearn/WebApp1.3 and the Web1.3 Server contributors.