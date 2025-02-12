# KSWO Navi
[![GitHub Release](https://img.shields.io/github/v/release/leon-kj/kswo_navi?include_prereleases&sort=date&display_name=release&label=Latest%20Release)](https://github.com/leon-kj/kswo_navi/releases)
[![GitHub License](https://img.shields.io/github/license/leon-kj/kswo_navi?label=License)](https://github.com/leon-kj/kswo_navi/blob/main/LICENSE.md)


This repo is a project for my project class at Kantonsschule Wohlen.  
  
## Installation
You can find and download the source Code under [releases](https://github.com/leon-kj/kswo_navi/releases).  

### Installing dependencies  
For this project to work, you'll need to have [Node.js](https://nodejs.org/en) and [git](https://github.com/git-guides/install-git) installed.  
For the database [PostgreSQL](https://www.postgresql.org/) is needed. Make sure to **include PostGIS** in the installer!!  
For the backend install [Express](https://expressjs.com/) with `npm install express --save` and [cors](https://www.npmjs.com/package/cors) with `npm install cors`.  
That the Vite will work correctly you'll need to install [mkcert](https://mkcert.org/) with `npm install mkcert`.  
  
### Initialize project
Open the command prompt and run the following command `npm create ol-app kswo_navi`.  
This will create an [OpenLayers](https://openlayers.org/) project.  
Open the newly created folder `kswo_navi`. You can now copy everything from the source code into the projectfolder.  

### Setting up the PostgreSQL database
In pgAdmin 4 you can create a new database named `kswo_navi_rooms`. Right click on the database and choose `restore`.  
Locate the `data-xxxxx.sql`-file in the source code and import it. Now simply click on restore and everything should be setup.  
  
### Setting up variables  
In the root of the project create a `.env`-file and inlcude the line `VITE_MAPTILEE_API_KEY=<your MapTiler api key>`.
You can create an account and maps api key at [MapTiler](https://maptiler.com).  
In the `/server` folder, create a `password.txt` where you need to type in your database password.

  
## Starting the application
Start the VITE frontend server with `npm start` for a dev server. The server should be available under [https://localhost:5173](https://localhost:5173).  
Start the backend with `node server/server.js`. Note that the backend won't get access to a database, as the db is running locally on my personal machine.   
