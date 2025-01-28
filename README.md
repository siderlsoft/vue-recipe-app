# Recipe App - Vue 3 + TypeScript + Vite + Tailwind

This project is a Vue 3 application with TypeScript, built using Vite as the development build tool. The application allows users to search, filter, and sort recipes by consuming a public API (`https://dummyjson.com/docs/recipes`). Also allows to create, modify and remove recipes from the state. It utilizes several modern tools and libraries to enhance the development experience and the application's functionality.

### Technologies Used:
- **Vue.js 3**: A modern JavaScript framework for building user interfaces.
- **TypeScript**: Adds type safety to JavaScript, improving maintainability and developer productivity.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Pinia**: A state management library for Vue 3 (the official store solution).
- **Axios**: A promise-based HTTP client for the browser and Node.js to make API requests.
- **Vue Router**: The official router for Vue.js, used for managing routes in the application.
- **Vue Toastification**: A library for displaying toast notifications.

### Features:
- **Recipe Search**: Users can search for recipes.
- **Sorting and Filtering**: Recipes can be sorted and filtered based on criteria such as meal type or ingredients.
- **Image Preview**: Recipes with images are displayed, and users can view a preview of recipe images.
- **Infinite Scroll**: The application supports infinite scrolling to load more recipes as the user scrolls down.
- **Recipe Form**: The application allows to view, edit and create recipes with a reactive form.

### Setup and Configuration:

#### 1. Clone the repository:

```bash
git clone https://github.com/siderlsoft/vue-recipe-app.git
cd vue-recipe-app
```

#### 2. Install dependencies:
To install the necessary dependencies, use npm or yarn (depending on your package manager preference):

```bash
npm install
# or
yarn install
```
#### 3. Configure the API:

The application consumes the public API provided by [Dummy JSON Recipes API](https://dummyjson.com/docs/recipes). No additional API configuration is required since it uses the public endpoints.

However, you can modify the base URL or parameters in the `axios` configuration file (`src/api/RecipeApi.ts`) if you need to use a different API or adjust request settings.

#### 4. Run the application:

Once all dependencies are installed, you can run the development server with the following command:

```bash
npm run dev
# or
yarn dev
```
This will start the Vite development server and you can access the app in your browser at http://localhost:5173 or any other assigned port.

#### 5. Building the app for production:

To build the application for production, run the following command:

```bash
npm run build
# or
yarn build
```

This will bundle the app into a ```dist/``` folder that can be deployed to a production server.

#### 6. Running tests:

At this moment the repo does not have any test available.

### Architectural Decisions:

1. **Vue 3 with Composition API**: We used Vue 3's Composition API (`setup()`) for organizing logic and reactivity. This allows for better code organization, especially as the application grows.
   
2. **Pinia for State Management**: Pinia is used to manage global state, which is a better alternative to Vuex in Vue 3. It provides a simple and type-safe API to manage the application state.

3. **Axios for API Requests**: Axios is used for making API calls to fetch recipes from the `https://dummyjson.com/docs/recipes` endpoint. It provides a clean and consistent way of making HTTP requests and handling responses.

4. **Tailwind CSS**: Tailwind is used for styling. Its utility-first approach allows for rapid styling without writing custom CSS. Tailwind’s responsiveness features help the app adjust nicely across different screen sizes.

5. **Vue Router**: We use Vue Router for navigation, allowing users to navigate between different parts of the application, like creating or viewing a recipe.

6. **Vue Toastification**: For displaying non-intrusive toast notifications (e.g., for success or error messages), Vue Toastification is integrated.
