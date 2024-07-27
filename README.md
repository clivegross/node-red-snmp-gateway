# Node-RED SNMP Gateway

This Node-RED project is a middleware service used to fetch SNMP objects from devices, store them in a local SQLite database, and serve the data over HTTP.

In summary, the application does 3 things:

1. Initialise: On startup, creates a SQLite database (or drops and recreates the tables if it already exists) and optionally populates it with an snmp object list and device list, loaded from a user defined csv file.
2. Fetch snmp values: Continually fetches object values from SNMP devices and inserts/updates the database.
3. HTTP serve XML: Provides a basic XML web API. Listens on a http endpoint and responds with SNMP object and device data from the database in an XML format.

Note that while the application provides nodes to serve the SNMP data as an XML web service (3), all the snmp data is written to and read from a SQLite database, so this interface could easily be swapped out for any other protocol, eg Modbus TCP, JSON API etc.

## Quick start

To deploy in your existing Node-RED instance:

1. Enable [projects](https://nodered.org/docs/user-guide/projects/) in your Node-RED instance if they aren't already.
1. Download and unzip this project into your Node-RED `projects` directory.
1. Install dependency nodes, see [below](#dependencies).
1. Configure the SNMP objects csv file, see [below](#configure-flow).
1. Start the server, open the flow and configure filepaths, web service and database as required.

If you'd like to deploy Node-RED and `node-red-snmp-gateway` to production on a Windows machine, see [below](#deploy-to-production-on-windows)

## Dependencies

- Node.js (if SNMPv3 DES Privacy algorithm, install Node.js v16 or less, see below)
- Node-RED
- Git (optional, for running as a [Node-RED Project](https://nodered.org/docs/user-guide/projects/))
- pm2-installer & pm2 (optional, for running Node-RED on Windows as a service)
- Node-RED nodes:
    - node-red-node-snmp
    - node-red-node-sqlite (optional, for storing data in sqlite)

## Configure flow

The `node-red-snmp-gateway`

### 1. Initialise

Prepare CSV config file

### 2. Fetch SNMP values

xxx

### 3. HTTP serve XML

xxx

## Deploy to production on Windows

In a default Node.js install, node modules (including Node-RED) are installed in the current users `%APPDATA%`. In a default Node-RED install, the Node-RED `userDir` is installed in the current users `~\.node-red` directory. Neither of these will work well if the flow is to run in production as a service, independently of user login, and handle server restarts and faults.

Instead, [pm2-installer](https://github.com/jessety/pm2-installer) shall be used to install `npm` and `node-red` in `%PROGRAMDATA%`, ie:

```
- C:\
  - ProgramData
   - npm
   - node-red
     - projects
       - node-red-snmp-gateway
         - flows.json
         - data
           - SNMPObjectList.csv
           - db
     - settings.js
```

`pm2-installer` also enables the `node-red` instance to be run as a Windows service using `PM2`.

In summary, deployment to production on Windows requires the following steps:

1. Install Node.js
2. Install and configure pm2-installer
3. Install Git for Windows
4. Install and configure Node-RED
5. Install dependency nodes
6. Install and configure Node-RED SNMP Gateway

### 1. Install Node.js
Download and install [Node.js for Windows, following instructions on the site](https://nodejs.org/en/download/prebuilt-installer/current).

Note: If SNMPv3 DES Privacy algorithm, install Node.js v16. [Here's why](https://github.com/node-red/node-red-nodes/issues/1034#issuecomment-2067512877).

### 2. Install and configure pm2-installer
This is required to run `node` and `pm2` as local system user and install modules in `%PROGRAMDATA%` instead of user `%APPDATA%`.

Download and install [pm2-installer, following the instructions on the site.](https://github.com/jessety/pm2-installer).

### 3. Install Git for Windows

Node-RED SNMP Gateway is ideally run as a [Node-RED Project](https://nodered.org/docs/user-guide/projects/). Node-RED Projects requires Git. Download and install [Git for Windows](https://git-scm.com/download/win). The application doesn't have to be run as a Node-RED Project, so this step can be skipped if you know what you're doing.

### 4. Install and configure Node-RED

Install Node-RED using npm [following installation on Windows instructions on Node-RED site](https://nodered.org/docs/getting-started/windows).

```
npm install -g --unsafe-perm node-red
```

```
mkdir %PROGRAMDATA%\node-red
cd %PROGRAMDATA%\node-red
!!! copy settings.js into %PROGRAMDATA%\node-red
node-red --settings ./settings.js
```
Nodes must be installed globally, using `-g` switch

Add `NODE_RED_HOME` to system environment variables, otherwise node-red home directory will default to `C:\Users\{{current user}}\.node-red`.

`NODE_RED_HOME: C:\ProgramData\node-red`

![NODE_RED_HOME](./images/add-node_red_home.png)


### 5. Install Node-RED dependency nodes

#### node-red-node-sqlite

`node-red-node-sqlite` depends on modules that require Python 3, so install `python3` first. Either download and install following instructions on [official Python website](https://www.python.org/downloads/windows/) or install using your orgainsations Software Centre:

![Software Centre](./images/install-python-from-software-centre.png)

The path to python.exe must be added to the `PATH` system environment variable. Also `PYTHONPATH` must be added as a system environment variable. This may or may not have been completed during installation. If not, add them manually. To permanently modify the default environment variables, click Start and search for 'edit environment variables', or open System properties, Advanced system settings and click the Environment Variables button.

![edit system environment variables](./images/edit-system-env-variables.png)
![Add python to PATH](./images/update-path.png)
![Add PYTHONPATH](./images/add-pythonpath.png)

### 6. Install and ocnfigure Node-RED SNMP Gateway

Download and unzip or clone this repository into `%PROGRAMDATA%/node-red/projects`

### Logging

If running the `node-red-snmp-gateway` as a Windows service using `pm2`, logging is handled automatically using `pm2-logrotate`, which is automatically installed with `pm2-installer`. Any `node-red` console logs will be written to `%PROGRAMDATA%\pm2\home\logs`.

You will probably want to configure `pm2-logrotate` to suit your needs, open a powershell terminal as Administrator:

```
# install pm2-logrotate if it isnt already
pm2 install pm2-logrotate
# view pm2 and pm2-logrotate config
pm2 conf
# configure pm2-logrotate using
# pm2 set pm2-logrotate:<param> <value>
# rotate logs daily at midnight
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
# limit max log file size
pm2 set pm2-logrotate:max_size 1M
# set log retention (number of files to keep)
pm2 set pm2-logrotate:retain 500
```


## Project Structure

The project is structured into three main flows and several subflows:

### Flows

1. Flow snmp fetch (ID: d353a7da6ed8c594): This flow is responsible for fetching SNMP object values from devices. It uses the "snmp-authPriv-SHA-DES fetch and save" subflow to fetch the values and either insert new records or update existing ones in the SQLite database.

2. Flow http serve (ID: 8902b921da4a441e): This flow listens on a HTTP endpoint and responds with SNMP object data and values from the SQLite database.

3. Flow tests (ID: 5bb232ee4f529f6f): This flow contains tests for the project.

### Subflows

1. snmp-authPriv-SHA-DES fetch and save (ID: 4cb39d2ff60de472): This subflow fetches SNMP object values from devices using the SNMP protocol with AuthPriv security and SHA-DES encryption, and saves the values to the SQLite database.

## Database Operations

All database operations (fetching, inserting, updating) are handled by a separate 'controller' subflow named "DBController". This subflow interacts with the SQLite database based on the required action from the calling flow, which is specified in the msg.action property of the message sent to the subflow. The possible actions are "insert", "update", "delete", "select", and "upsert" (update existing records or insert new ones).

## Usage

To fetch SNMP object values from devices and store them in the SQLite database, trigger the "Flow snmp fetch". To serve the SNMP object data and values over HTTP, use the "Flow http serve".

## Testing

To run the tests for the project, trigger the "Flow tests".
