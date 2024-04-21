# Node-RED SNMP Fetcher Service

This Node-RED project is a middleware service used to fetch SNMP object values from devices, store them in a SQLite database, and serve them over HTTP. The application does 3 things:

1. Initialise: On startup, creates a SQLite table (deletes the table first if it exists) and optionally populates it with an snmp object list, loaded from a csv file.
2. Fetch values: Fetches object values from SNMP devices and inserts/updates the database.
3. HTTP serve: Listens on a http endpoint and responds with SNMP object data and values from the database.

## Setup

To set up the project:

1. Import the project into your Node-RED instance.
2. Install dependencies.
3. Configure the SNMP devices as needed, .

### Dependencies

- node-red-node-snmp
- node-red-node-sqlite

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
