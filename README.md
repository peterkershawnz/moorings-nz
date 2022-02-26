# A marketplace for moorings and marina berths

## Description

This project is to build an online marketplace where owners list their moorings and marina berths for short-term rentals.

## The how

Mooring data for the following locations has been obtained from [data.govt.nz](https://data.govt.nz/).

- Northland
- Auckland
- Marlbourgh

All mooring data is going to be stored in MongoDB and a Postgres database with the PostGIS extension. This will allow me to test the relational and non-relational databases side by side.

Nextjs will be used for the front-end and Mapbox to display the moorings on a map.

Using Stripe [Connect](https://stripe.com/docs/connect) to handle the payment system.

The below requirement will increase and change as I progress through the project.

## Part A

Design an API to the OpenAPI Specification.

- Using Stoplight to design the API

## Part B

Database Schema Design

- The database to be designed in dbdiagram.io

## Part C

Data reconstruction

- The data needs to be standardizing since each loction provides the data in a different way

## Part D

Build the API

- A mooring endpoint to be created and I will use the repository design pattern to allow me to swap put the databases.

## Part E

Testing

- Jest to be used to create suitable unit, integration and end to end tests

## Part F

Client side

- Using nextjs to build a front end
- Mapbox for the map
- Stipe Connect
