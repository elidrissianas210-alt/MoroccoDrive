# Car Card Component

## Purpose

The Car Card is the primary component used to present a rental vehicle across the MoroccoDrive marketplace.

Its objective is to help users compare vehicles quickly and encourage them to view details or book.

---

## Used In

- Landing Page
- Search Results
- Similar Cars
- Favorites
- Compare
- Agency Public Profile

---

## Variants

### Standard

Used in search results.

### Compact

Used in carousels.

### Horizontal

Used in recommendations.

### Compare

Used in compare mode.

---

## Information Displayed

### Vehicle

- Main Image
- Gallery Count
- Vehicle Name
- Brand
- Model
- Year

---

### Rental Information

- Price Per Day
- Total Price
- Currency (MAD)

---

### Specifications

- Transmission
- Fuel Type
- Seats
- Doors
- Air Conditioning

---

### Agency

- Agency Logo
- Agency Name
- Verified Badge
- MoroccoDrive Trust Score
- Customer Rating
- Number of Reviews

---

### Availability

- Instant Booking
- Free Cancellation
- Unlimited KM
- Airport Pickup (optional)
- Hotel Delivery (optional)

---

## Actions

Primary

- View Details

Secondary

- Favorite
- Compare
- Share

---

## States

Loading

Skeleton Card

Empty

No image placeholder

Unavailable

Booking disabled

Featured

Best Value badge

Top Rated

Premium badge

---

## Business Rules

Always display:

- Price
- Agency
- Rating
- Main Image

Do not display unavailable vehicles unless the user explicitly requests them.

Highlight:

- Verified agencies
- Instant booking
- Free cancellation

---

## Responsive Behavior

Desktop

Grid Layout

Tablet

2 Columns

Mobile

Single Column

Touch-friendly buttons.

---

## Accessibility

- Keyboard navigation
- Screen reader labels
- High contrast
- Focus states
- Accessible buttons

---

## Future Features

- AI Recommendation Badge
- Carbon Emission Indicator
- Electric Vehicle Badge
- Dynamic Discounts
- Last Booking Alert
- Limited Availability Alert

---

## Design Notes

The card must immediately communicate:

1. Trust

2. Price

3. Availability

4. Vehicle Quality

5. Agency Quality

Users should be able to compare multiple vehicles in less than 10 seconds.