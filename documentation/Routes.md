# Stockflow frontend routes

## Features

The main features of this application are going to be the following

- Page to view all product categories, to access any of them
- Page to create and edit categories
- "Detail page" for a category listing all products of that category, paginated
- Detail page for a product, which displays the product information and the counts of instances of that product
- Page to view a list of instances of a product (paginated), not a count.
- Page to create or edit products
- View existing client orders page
- Create new client order page
- Stock intake page
- Login page
- A user management console for admin users
- ...

## Routes

The route structure will look something like:

- /categories
  - /  <-- All categories
  - /create
  - /edit/:categoryId
  - /detail/categoryId
- /products
  - /count/:prodId
  - /instances/:prodId
  - /instances/edit/:prodId
  - /create
  - /edit/:prodId
  - /intake-order
- /orders
  - /create
  - /edit/:orderId
  - /all
- /auth
  - /login
- /admin
  - /user-management
    - /create
    - /edit/:userId
