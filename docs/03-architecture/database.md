# Database Architecture

## Overview

MoroccoDrive uses a relational PostgreSQL database hosted on Supabase.

The database is designed to support:

- Multi-agency architecture
- Subscription-based SaaS
- Online bookings
- Secure online payments
- Digital rental contracts
- Customer reviews
- Scalable feature management

The schema follows normalization principles while remaining practical for performance.

---

# Main Domains

The database is divided into the following domains:

1. Authentication
2. Agencies
3. Subscription System
4. Vehicle Management
5. Booking System
6. Payment System
7. Rental Contracts
8. Reviews
9. Favorites

---

# Authentication

## profiles

Represents every authenticated user.

Roles:

- customer
- agency
- admin

Each profile belongs to exactly one authenticated Supabase account.

---

# Agencies

## agencies

Represents rental agencies registered on MoroccoDrive.

One agency can own multiple vehicles.

Each agency has exactly one active subscription.

---

# Subscription System

## plans

Available subscription plans.

Examples:

- Starter
- Pro
- Business

---

## subscription_features

Defines configurable subscription features.

Examples:

- max_cars
- max_images_per_car
- analytics
- commission_rate
- featured_cars

---

## plan_features

Maps plans to their enabled features and values.

This allows adding new subscription features without changing the database schema.

---

## subscriptions

Represents an agency's current subscription.

Contains:

- billing cycle
- current status
- provider
- renewal dates

---

# Vehicle Management

## brands

Vehicle manufacturers.

Examples:

- BMW
- Mercedes
- Porsche

---

## models

Vehicle models.

Each model belongs to one brand.

---

## car_categories

Vehicle categories.

Examples:

- SUV
- Sedan
- Hatchback
- Luxury
- Electric

---

## cars

Main vehicle table.

Each vehicle belongs to exactly one agency.

Each vehicle belongs to one model.

Each vehicle belongs to one category.

---

## car_images

Stores all vehicle images.

Maximum allowed images depends on the agency subscription.

---

## features

Available vehicle features.

Examples:

- GPS
- Bluetooth
- Automatic
- Child Seat

---

## car_features

Many-to-many relationship between cars and features.

---

# Booking System

## bookings

Stores every reservation.

Lifecycle:

Pending

↓

Confirmed

↓

Completed

or

Cancelled

---

## booking_drivers

Stores additional authorized drivers.

One booking may contain multiple drivers.

---

# Payment System

## payments

Stores every payment transaction.

Initial provider:

- Stripe

Future providers may be added without changing the schema.

---

# Rental Contracts

## rental_contracts

Digital rental agreements generated after payment.

---

## contract_signatures

Stores digital signatures for contracts.

A contract may contain:

- Customer signature
- Agency signature

---

# Reviews

## reviews

Customers may review only completed bookings.

Each review is linked to:

- booking
- vehicle
- agency
- customer

---

# Favorites

## favorites

Allows customers to save vehicles.

One customer may favorite many vehicles.

One vehicle may be favorited by many customers.

---

# Design Principles

- UUID primary keys
- PostgreSQL
- Foreign key constraints
- Soft deletes only when required
- Automatic timestamps
- Proper indexing
- Normalized relationships
- No duplicated business data

---

# Future Extensions

The database is prepared for:

- Multiple agency branches
- Coupons
- Loyalty points
- Fleet analytics
- Insurance management
- Driver verification
- Mobile application
- Additional payment providers
