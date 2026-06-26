# Savery

A web application that helps college students discover affordable recipes, save their favorites, and create budget-friendly meal plans.

---
Feedback:

This is a great and useful website and I love the features you added! Being able to track your ingredients and know what you'll have leftover so you can use them makes this meal prep plan so unique and relevant for college students on a budget. Very cool that you can plan your next meals around leftovers from previous meals. You included the cost for the grocery store trip in addition to the cost per serving which is also a great feature, allowing for precise financial planning during meal prep. I love the customizeable meal prep plans, excellent touch! All the features you implemented seem to work very well!

I had some difficulty navigating back to the main page that lists all the recipes, once I clicked into the meal prep section and favorites screen. I realized you could just click on the logo in the top center and you would navigate back to the main page - I would suggest also adding a button to make it more clear to users how to get back to 'home.' Also as you scroll through the recipes, some of the images aren't rendering at times. I also ran it through the w3 validator and there was only 1 warning about a header field, great job! 

One thing I might add would be a way of the user logging in. I saw in the routes that you used a demo-user which is hardcoded for the app to work. If I want to log in from a different device and access all my saved meal plans and favorites, it currently saves everything I enter from any device and any browser, so making this unique to the user would be helpful. It would also be cool to have a group meal plan with other users attached, so we can all create a weekly meal prep together and have a cost breakdown of what each person will spend on a shared meal plan. 

You have consistent try/catch blocks on every route with input validation before hitting the database. You have all the correct HTTP status codes for bad input, created & server errors. There is clean separation between the database logic too. The front end, css and html files are well organized and very logical making this code super easy to read and understand. You both did an outstanding job on this! 

---

## Authors

- **Melissa Rejuan**
- **James Jacob**

## Live Demo

[https://savery-production.up.railway.app/](https://savery-production.up.railway.app/)

## Class Link

> Replace the URL below with your course Canvas or syllabus page before submitting.

[Web Development — Project 2](https://YOUR-COURSE-LINK-HERE)

## Project Objective

Savery helps college students eat well on a tight budget. Users can:

- **Discover recipes** with search, filters (cuisine, meal type, diet, prep time), and a cost-per-serving range slider
- **View recipe details** including shopping lists, ingredient costs, instructions, and leftover recommendations
- **Save favorites** to MongoDB for quick access later
- **Create and submit recipes** that are stored in the database and appear on the discovery page
- **Plan weekly meals** on a Breakfast / Lunch / Dinner grid and save meal plans to MongoDB

The app uses a multi-page **client-side rendered (CSR)** frontend, an **Express** REST API, and **MongoDB** for persistence.

## Screenshot

![Savery Recipe Discovery](./docs/screenshots/discovery.png)

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Recipe Discovery | `/index.html` | Browse, filter, and expand recipes |
| Create a Recipe | `/createRecipes.html` | Submit a new recipe to the database |
| Plan Your Meals | `/planner.html` | Build and save weekly meal plans |
| Favorites | `/favorites.html` | View and remove saved recipes |

## Technologies

- HTML5, CSS3, Bootstrap 5
- JavaScript (ES6 modules)
- Node.js, Express.js
- MongoDB (native driver)

## Project Structure

```
Savery/
├── backend.js              # Express server entry point
├── routes/                 # API route modules
│   ├── recipeApi.js
│   ├── favoritesApi.js
│   └── plannerApi.js
├── db/
│   └── MyMongoDB.js        # Database connector module
├── data/
│   └── recipes.json        # Seed data (1000 recipes)
├── scripts/
│   └── seed-mongodb.js     # Loads recipes into MongoDB
└── frontend/
    ├── index.html          # Recipe Discovery
    ├── createRecipes.html
    ├── planner.html
    ├── favorites.html
    ├── css/                # Modular stylesheets per page
    └── js/                 # Page scripts (ES modules)
```

## MongoDB Collections

| Collection | Purpose |
|------------|---------|
| `Recipes` | Recipe documents (seeded + user-submitted) |
| `Favorites` | Saved recipe IDs per user |
| `MealPlans` | Weekly meal plan documents |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/) running locally **or** a MongoDB Atlas connection string

## Instructions to Build and Run

### 1. Clone the repository

```bash
git clone https://github.com/jamesjacob2001/Savery.git
cd Savery
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB

**Local (default):** make sure MongoDB is running on `mongodb://localhost:27017`.

**MongoDB Atlas (optional):** set your connection string before seeding or starting the server:

```bash
export MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
```

### 4. Seed the database

This loads `data/recipes.json` into the `Savery.Recipes` collection (replaces existing recipe documents):

```bash
npm run seed
```

### 5. Start the server

```bash
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

### 6. Verify the app

- Open **Recipe Discovery** — you should see the recipe grid after seeding
- Try **Favorites** (heart icon on a card) and **Plan Your Meals** (add recipes to slots and save a plan)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/recipes` | List all recipes |
| `POST` | `/api/recipes` | Create a recipe |
| `GET` | `/api/favorites` | List saved favorites |
| `POST` | `/api/favorites` | Save a favorite |
| `DELETE` | `/api/favorites/:recipeId` | Remove a favorite |
| `GET` | `/api/planner` | List meal plans |
| `POST` | `/api/planner` | Create a meal plan |
| `PUT` | `/api/planner/:id` | Update a meal plan |
| `DELETE` | `/api/planner/:id` | Delete a meal plan |

## License

MIT
