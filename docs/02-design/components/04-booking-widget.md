# Booking Widget

## Purpose

The Booking Widget is the primary conversion component of MoroccoDrive.

Its goal is to allow users to configure their reservation and complete the booking with maximum confidence.

---

## Used In

- Car Details Page

---

## Layout

Sticky Card on Desktop.

Bottom Sheet on Mobile.

---

## Fields

Pickup Date

Pickup Time

Return Date

Return Time

Pickup Location

Return Location

Driver Age (optional)

Promo Code (optional)

Insurance Package

Extras

---

## Extras

GPS

Child Seat

Additional Driver

Wi-Fi

Unlimited Mileage Upgrade

Airport Delivery

Hotel Delivery

---

## Price Breakdown

Rental Price

Extras

Insurance

Taxes

Discount

Deposit

Total Price

Display all prices in MAD.

---

## Actions

Primary

Book Now

Secondary

Save for Later

Share

---

## Validation

Return date must be after pickup date.

Pickup and return time are required.

Vehicle availability must be checked before confirming.

Driver age restrictions must be validated.

---

## Business Rules

Always display:

- Total Price
- Deposit (if required)
- Cancellation Policy
- Instant Booking status

If Instant Booking is unavailable:

Replace "Book Now" with "Request Booking".

---

## States

Available

Unavailable

Pending

Loading

Booked

---

## Responsive Behavior

Desktop

Sticky Sidebar

Tablet

Normal Card

Mobile

Bottom Sheet

---

## Accessibility

Keyboard navigation

Screen reader labels

Visible focus states

Large touch targets

---

## Future Features

Coupon Engine

Loyalty Points

Dynamic Pricing

AI Price Recommendation

Split Payment

---

## Design Notes

The widget must clearly answer:

- What am I paying?
- What is included?
- Can I cancel?
- Is the vehicle available?
- What happens next?

The booking process should require as little effort as possible while maintaining transparency.