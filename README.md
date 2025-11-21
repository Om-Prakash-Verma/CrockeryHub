# CrockeryHub - Next.js & Firebase E-commerce Platform

Welcome to the CrockeryHub, a full-stack e-commerce website built for a specialized crockery gallery. This platform is designed to be both a beautiful public-facing storefront and a powerful, easy-to-use content management system for the site owner.

The project is built with a modern tech stack:
- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **AI Features:** [Genkit](https://firebase.google.com/docs/genkit)

## Getting Started

Follow these steps to get the development environment running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm or yarn

### 1. Firebase Setup

Before running the application, you need to connect it to a Firebase project.

1.  **Create a Firebase Project:**
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click on **"Add project"** and follow the on-screen instructions to create a new project.

2.  **Enable Firestore and Authentication:**
    - In your new project's dashboard, go to the **Build** section on the left sidebar.
    - Click on **Firestore Database** and then **"Create database"**. Start in **test mode** for easy setup.
    - Click on **Authentication**. Go to the **"Sign-in method"** tab and enable the **Email/Password** provider.

3.  **Get Firebase Config:**
    - In the Firebase console, click the **Project Overview** gear icon and select **Project settings**.
    - Scroll down to the "Your apps" section and click on the **Web** icon (`</>`) to create a new web app.
    - Give your app a nickname and click **"Register app"**.
    - Firebase will provide you with a `firebaseConfig` object. Copy this object.

4.  **Create Environment File:**
    - In the root of your project, create a new file named `.env`.
    - Paste the `firebaseConfig` object into the `.env` file and format it as environment variables. It should look like this:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
    NEXT_PUBLIC_INSTAGRAM_ID="Your Insta Id"
    NEXT_PUBLIC_SHOP_ADDRESS="Shop Address"
    NEXT_PUBLIC_HERO_HEADLINE="From Kitchen to Table — Elegance Redefined"
    NEXT_PUBLIC_HERO_SUBHEADING="Explore premium crockery and kitchenware crafted to elevate your dining experience."
    NEXT_PUBLIC_SITE_TITLE="Shree Enterprises"
    NEXT_PUBLIC_ABOUT_US_CONTENT="Welcome to Shree Enterprises, your trusted destination for premium utensils and kitchenware. We believe that every kitchen deserves products that combine functionality, durability, and style. At Shree Enterprises, we offer a wide range of kitchen essentials — from stainless steel utensils to modern cookware and serving accessories — carefully selected to meet the needs of every home and professional kitchen.

    With a commitment to quality and customer satisfaction, we bring you products that make cooking and dining a delightful experience. Whether you’re setting up your kitchen or upgrading your collection, explore our range and discover the perfect blend of practicality and elegance."
    ```
    
5. **Create an Admin User:**
    - To access the admin panel, you must create a user account.
    - In the Firebase console, go back to **Authentication** and click on the **Users** tab.
    - Click **"Add user"** and enter the email and password you want to use for your admin account.
    - You will use these credentials to log in at `yourwebsite.com/login`.

### 2. Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the application:**
    The application will be running at [http://localhost:9002](http://localhost:9002).

## Environment Variables

The application uses environment variables for configuration. You can find them in the `.env` file.

- **Firebase Configuration:** The `NEXT_PUBLIC_FIREBASE_*` variables are used to connect to your Firebase project.
- **Hero Headline:** The `NEXT_PUBLIC_HERO_HEADLINE` variable allows you to set the main headline for the hero section on the homepage.
- **Hero Subheading:** The `NEXT_PUBLIC_HERO_SUBHEADING` variable allows you to set the subheading text for the hero section on the homepage.
- **Products Subheading:** The `NEXT_PUBLIC_PRODUCTS_SUBHEADING` variable allows you to set the subheading text for the "Our Products" section on the homepage.
- **About Us Section:** The `NEXT_PUBLIC_ABOUT_US_CONTENT` variable allows you to set the text for the "About Us" section on the homepage. You can use `\n` for line breaks.

## Core Features

The application is divided into two main parts: the public-facing website where customers browse and purchase products, and the private admin panel for site management.

---

### 1. Public-Facing Website

This is the storefront that your customers will interact with.

-   **Home Page (`/`)**
    -   A dynamic and customizable landing page.
    -   **Hero Section:** A large, eye-catching banner to welcome visitors.
    -   **About Us Section:** A customizable section to tell your brand's story.
    -   **Category & Brand Carousels:** Interactive carousels for customers to browse products by category or brand.
    -   **Product Collection:** A grid showcasing featured or recent products.
    -   *Admin Control:* The visibility of each of these sections can be toggled on or off from the admin panel settings.

-   **Product Listing Pages (`/products` and `/products?category=...`)**
    -   Displays a grid of all available products.
    -   Supports filtering by category, allowing customers to view specific collections (e.g., "Dinnerware").

-   **Product Details Page (`/products/[slug]`)**
    -   A dedicated page for each product.
    -   **Image Carousel:** Customers can view multiple high-quality images of the product.
    -   **Detailed Information:** Includes product name, price, a full description, and detailed specifications (material, dimensions, origin).
    -   **"Buy via WhatsApp" Button:** A direct call-to-action that opens WhatsApp with a pre-filled message, making it easy for customers to inquire or purchase.

-   **Browse by Category/Brand (`/categories`, `/brands`, `/brands/[slug]`)**
    -   Dedicated pages that list all available categories and brands.
    -   Clicking on a category or brand takes the user to a filtered view of products.

-   **Contact Page (`/contact`)**
    -   A fully functional contact form.
    -   Includes standard fields (Name, Email, Subject, Message) and can be extended with **dynamic custom fields** (e.g., "Order Number") that are managed directly from the admin panel.

-   **Owner's Guide (`/guide`)**
    -   A public-facing guide that explains all the features of the admin panel, serving as a handy reference for the site owner.

---

### 2. Admin Panel

The admin panel is the control center for the entire website, accessible at `/admin`. It allows the site owner to manage all content without writing any code.

-   **Dashboard (`/admin`)**
    -   Provides an at-a-glance overview of key metrics:
        -   Total number of products.
        -   Total number of categories and brands.
        -   Count of contact form submissions.

-   **Product Management (`/admin/products`)**
    -   Full CRUD (Create, Read, Update, Delete) functionality for products.
    -   Includes fields for name, slug (auto-generated), price, descriptions, specifications, category, brand, and multiple images.
    -   A responsive table and card-based layout for easy management on both desktop and mobile.

-   **Category Management (`/admin/categories`)**
    -   Create and manage product categories.
    -   Supports **nested sub-categories** (e.g., "Dinnerware" as a parent to "Plates").
    -   Prevents deletion of parent categories to maintain data integrity.

-   **Brand Management (`/admin/brands`)**
    -   Add and edit brands.
    -   Fields for name, description, and a logo URL with a live preview.

-   **Contact Form Submissions (`/admin/submissions`)**
    -   View all messages sent through the contact form, sorted by date.
    -   A detailed view shows the full message and any custom data submitted.
    -   Submissions can be deleted with a confirmation step.

-   **Dynamic Form Fields (`/admin/custom-fields`)**
    -   Add, edit, or remove custom fields on the public contact form.
    -   Define a field's label, type (text or textarea), and whether it is required.

-   **Site Settings (`/admin/settings`)**
    -   **WhatsApp Number:** Update the phone number for the "Buy via WhatsApp" button.
    -   **Homepage Section Visibility:** Use toggle switches to show or hide the Hero, Categories, Brands, and Products sections on the homepage.
