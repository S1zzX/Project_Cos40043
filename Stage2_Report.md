# COS30043: Interface Design and Development
## Stage 2 Project Report: S1zz Custom E-Commerce Application

---

### 1. Main Functionality
**S1zz** is a modern, responsive e-commerce web application designed seamlessly to manage browsing and simulated purchasing experiences. The core functionalities of the application include:
*   **Dynamic Product Browsing:** Users can browse a catalogue of products populated dynamically via external APIs, view specific item details, and manage categories effortlessly.
*   **Advanced Shopping Cart & Wishlist:** Fully functional interactive carts tracking quantities, dynamically calculating GST and Shipping constraints, and wishlisting favorite products across browser sessions.
*   **Authentication-Based View Access:** Simulates registration and logins with "Customer" and "Admin" roles natively routing visibility (e.g. Hiding the "Cart" from Administrators, restricting Admins to the "Dashboard").
*   **Interactive News Portal:** A responsive news feed reading directly from local JSON files, fully equipped with comprehensive multi-field textual search and categorical pagination functionalities.

### 2. Technical Components & Tools Used
The application heavily utilizes modern web-development frameworks and tools to achieve a scalable and modular design:
*   **Vue.js 3 (Composition API):** Utilizes `setup` syntax, `computed` properties, and lifecycle hooks (`onMounted`) to manage robust components and reactive data flows efficiently.
*   **Vite:** Serves as the extremely fast build-tool and asset bundler allowing instant hot module replacements during development.
*   **Vue Router:** Implemented to navigate seamlessly between single-file components (`Home.vue`, `News.vue`, `About.vue`, `Cart.vue`) avoiding costly hard reloads. 
*   **Pinia Store:** Effectively coordinates application-level state (such as `products.js`, `cart.js`, and `auth.js`) guaranteeing structured data access everywhere in the component tree.
*   **Bootstrap 5:** Leveraged for applying a mobile-first philosophy. Uses native responsive grid structures (`col-12 col-md-6`) and accessibility configurations optimizing cross-device experiences.
*   **Axios:** Executes asynchronous HTTP requests efficiently to interface with external endpoints (DummyJSON API) to pull down authentic application data.

### 3. Innovative Features & Unique Approaches
*   **Advanced Pinia Persistence System:** Developed a customized deep-watching pinia plugin (`usePersistedState` in `piniaPersistedPlugin.js`). This automatically serializes state changes directly into standard `localStorage` with intelligent performance "debouncing" ensuring heavy array manipulation doesn't flood the browser memory buffer.
*   **User-Segmented Data Dictionaries:** A unique approach to local-storage mapping where cart arrays are saved inside an object dynamically matching the `auth.currentUser.id` keys (`user_1`, `guest`). This prevents "cart memory leaking" commonly seen when swapping accounts on the same computer!
*   **Dynamic Data Sanitization Checkers:** Implemented a system that actively verifies fetched external categories against the loaded API products array. Any "empty" categories are pruned before they reach the user interface, improving accuracy for the end user.
*   **Fluid Transitions:** Leveraged native Vue `<transition>` wrappers coupled with CSS to seamlessly animate layout changes (warning alerts and form validations disappearing smoothly depending on regex success conditions).

### 4. Challenges & Resolutions
*   **Challenge — Cross-API Response Incompatibilities:** Transitioning our internal infrastructure dynamically towards the *DummyJSON* API away from *FakeStore API* broke legacy front-end components because variable keys (`product.image` vs `product.thumbnail`) didn't match.
    **Resolution:** Wrote a specific mapping interceptor (`mapDummyProduct`) directly inside the API resolution try-catch block inside `stores/products.js`, intercepting and restructuring the DummyJSON responses to act and look exactly like the UI initially expected, preventing mass rewrite-headaches.
    
*   **Challenge — Limited/Empty API Responses:** Early testing showed that some alphabetically sorted categories via external fetching had zero loaded products. DummyJSON silently limited total elements heavily.
    **Resolution:** We utilized query expansion (`?limit=0`) to force the API gateway to return every product asynchronously to ensure equal distribution amongst all filtered sidebar options, giving our application its robust feel.

*   **Challenge — Admin Access Restrictions:** Handling global navigation visibility manually when toggling authentication routes proved overly complex across varying Single File Components.
    **Resolution:** Centralized `auth.isAdmin` logic as computed flags securely inside the authentication Pinia store. The flags control `v-if` visibility directly masking components (like hiding Wishlist/Cart navigations natively via `Navbar.vue`) and leveraging `useRouter().push()` inside Vue lifecycle scripts to kick unauthorized accessors backward automatically!
