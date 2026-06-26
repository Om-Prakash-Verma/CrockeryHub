# CrockeryHub

CrockeryHub is a high-performance, real-time enterprise kitchenware, dinnerware, and appliances digital showcase and content management platform built using Next.js 15 (App Router), TypeScript, Tailwind CSS, and Firebase. It features a client-facing web application optimized for speed and SEO, coupled with a fully-featured, secure Administrator Dashboard for real-time inventory management, dynamic branding, custom form management, and live website customization.

---

## Key Features

- **Real-Time Data Syncing**: Direct subscription to Firestore collections using real-time database snapshots (`onSnapshot`), providing instantaneous updates across the catalog without page refreshes.
- **Dynamic CSS Variable Theming**: A client-side styling engine that fetches the color configuration from Firestore settings and dynamically injects CSS custom properties (`:root { --primary, --accent, etc. }`) in real-time, allowing absolute control over site branding from the admin dashboard.
- **Dynamic Contact Form Fields**: Admins can define custom form fields at runtime (label, text vs. textarea, required flags) which automatically inject themselves into the public contact form.
- **Next.js Server Actions with Runtime Zod Extension**: The contact form processes submissions using server actions. The server dynamically fetches user-defined custom fields and extends the base validation schema using Zod at runtime before validating and submitting data.
- **Single-Click WhatsApp Ordering**: Integrates a seamless "Buy via WhatsApp" check-out button that prepopulates customer messages with product details and admin-configured phone numbers.
- **Advanced SEO & JSON-LD Structured Data**: Implements server-side metadata generation (`generateMetadata`) in dynamic routes to inject search-engine-optimized titles, OpenGraph images, and custom JSON-LD schemas representing a `Product` conforming to Schema.org standards (SKU, brand, price, offers, availability).
- **Non-Blocking Write Strategy**: Multi-threaded feeling updates utilizing non-blocking asynchronous wrappers for all create, update, and delete Firestore commands to ensure UI responsiveness.
- **Structured Error Management**: Encapsulates permission failures inside a custom `FirestorePermissionError` class designed to mirror Firestore's internal Security Rules evaluation context (with `request.auth`, `request.method`, `request.path`) for advanced debugging, routed through a global event-driven pub/sub listener.

---

## Technology Stack

- **Framework**: Next.js 15 (App Router, Server Actions, Dynamic Metadata)
- **Language**: TypeScript
- **Database & Auth**: Firebase Firestore & Firebase Authentication
- **Styling**: Tailwind CSS, CSS Custom Properties (Variables), Shadcn UI, Radix UI
- **Validation & Forms**: Zod, React Hook Form, `@hookform/resolvers`
- **Charts & UI Controls**: Recharts (for dashboard stats), Lucide React (for iconography), Embla Carousel (for product carousels)

---

## Project Structure

```
CrockeryHub/
├── public/                 # Static assets (images, logos, heroes)
├── src/
│   ├── ai/                 # Genkit initialization and development flows
│   ├── app/                # Next.js App Router (Layouts and Pages)
│   │   ├── admin/          # Admin Dashboard layout, stats, categories, products, settings, submissions
│   │   ├── brands/         # Brand landing pages
│   │   ├── categories/     # Public category browser
│   │   ├── contact/        # Contact form page and server actions
│   │   ├── guide/          # Owner's operational manual
│   │   ├── login/          # Administrator authentication page
│   │   └── products/       # Product details page (dynamic) and grid view
│   ├── components/         # React Components
│   │   ├── ui/             # Shadcn UI reusable components (button, dialog, card, etc.)
│   │   └── *.tsx           # Domain-specific components (forms, header, footer, product cards)
│   ├── firebase/           # Firebase Configuration, providers, hooks, and error helpers
│   │   ├── firestore/      # Real-time useCollection and useDoc custom hooks
│   │   └── *.ts*           # Non-blocking updates, error emitter, custom permission errors
│   ├── hooks/              # Global UI and toast hooks
│   └── lib/                # Shared utilities, types, and placeholder data
├── firestore.rules         # Declarative Firestore security access rules
├── storage.rules           # Cloud Storage security access rules
├── next.config.ts          # Next.js environment configurations
└── tailwind.config.ts      # Tailwind CSS theme customizations
```

---

## Key Architectural & Implementation Details

### 1. Dynamic Theming Engine
Instead of relying on static stylesheets, the application loads theme variables stored in a Firebase Firestore settings document. A client-side theme wrapper, [client-provider.tsx](file:///D:/Om%20Prakash/CrockeryHub/src/firebase/client-provider.tsx), evaluates these parameters and injects them as standard custom CSS properties into the HTML header:
```typescript
function DynamicThemeStyle({ settings }: { settings: AppSettings | null }) {
    const css = `
:root {
  ${settings?.themeForeground ? `--foreground: ${settings.themeForeground};` : ''}
  ${settings?.themeMutedForeground ? `--muted-foreground: ${settings.themeMutedForeground};` : ''}
  ${settings?.themePrimary ? `--primary: ${settings.themePrimary};` : ''}
  ${settings?.themeAccent ? `--accent: ${settings.themeAccent};` : ''}
}
    `.trim();
    if (!css.includes('--')) return null;
    return <style>{css}</style>;
}
```
This is fully reactive; as soon as the admin saves changes in the color picker, the website updates instantly.

### 2. Runtime Zod Schema Extension (Server Action)
To handle user-defined fields on the contact form, [actions.ts](file:///D:/Om%20Prakash/CrockeryHub/src/app/contact/actions.ts) extends a static schema dynamically by fetching current configurations from Firestore on the server side:
```typescript
export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const firestore = getFirestoreInstance();
  const customFieldsSnapshot = await getDocs(collection(firestore, 'custom_form_fields'));
  const customFields = customFieldsSnapshot.docs.map(doc => doc.data() as CustomFormField);

  let dynamicSchema = contactSchema; // Base schema (name, email, subject, message)
  
  for (const field of customFields) {
      const fieldSchema = field.required
        ? z.string().min(1, { message: `${field.label} is required.` })
        : z.string().optional();

      dynamicSchema = dynamicSchema.extend({
          [field.name]: fieldSchema,
      });
  }

  const validatedFields = dynamicSchema.safeParse(Object.fromEntries(formData.entries()));
  // ... proceed to write to firestore
}
```

### 3. Debug-Optimized Firestore Error Listener
Real-time hooks include strong validation and event-driven logging. When security rules deny access, the hook instantiates a `FirestorePermissionError` that constructs a simulated request context matching what Firebase's declarative rules check:
```typescript
export class FirestorePermissionError extends Error {
  public readonly request: SecurityRuleRequest;

  constructor(context: SecurityRuleContext) {
    const requestObject = buildRequestObject(context);
    super(buildErrorMessage(requestObject)); // Emits JSON details matching firestore rules structure
    this.name = 'FirebaseError';
    this.request = requestObject;
  }
}
```
This error is then captured by [error-emitter.ts](file:///D:/Om%20Prakash/CrockeryHub/src/firebase/error-emitter.ts) and caught by the global error boundary in Next.js.

---

## Local Development Setup

To run this project locally, ensure you have Node.js installed, then follow these steps:

1. **Clone the Repository**:
   ```bash
   cd CrockeryHub
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory and populate it with your Firebase configurations:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_SITE_TITLE=CrockeryHub
   NEXT_PUBLIC_SITE_URL=http://localhost:9002
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser to view the application.

---

## Firebase Rules

### Firestore Rules (`firestore.rules`)
Ensures public read access for store data but blocks write access for non-admins:
- `products`, `categories`, `brands`, `settings`, `custom_form_fields`: Read access is `true` for all. Write/Edit is limited to `request.auth != null`.
- `contact_form_submissions`: Public can `create` documents. Only authenticated admins (`request.auth != null`) can `get`, `list`, or `delete`. Updates are completely denied (`false`).

### Storage Rules (`storage.rules`)
Restricts object uploads and deletions inside Cloud Storage buckets exclusively to authenticated store administrators, whilst ensuring public read capabilities.

---

## Resume Section

Below is professional text and bullet points describing your work on this project that you can copy and paste directly into your resume under **Experience** or **Projects**:

### **Project Title**: CrockeryHub – Enterprise Catalog & Content Management Platform

#### **Technical Stack**
Next.js 15 (App Router, Server Actions), TypeScript, React 18, Firebase (Auth, Firestore, Cloud Storage, App Hosting), Tailwind CSS, Shadcn UI, Zod, React Hook Form, Recharts.

#### **Core Accomplishments & Bullet Points**
* **Architected and Developed** a high-performance, real-time catalog and content management system using Next.js 15 App Router and TypeScript, featuring a customer-facing shop and a secure, role-restricted admin panel.
* **Engineered a Dynamic HSL Styling Engine** that injects CSS custom variables at runtime (`:root` properties) fetched directly from a Firestore document, enabling full real-time design customizability directly from the user dashboard.
* **Implemented Next.js Server Actions with Dynamic Schema Extensions**, constructing a form system that retrieves administrator-defined custom fields at runtime and dynamically extends Zod validation schemas on the server before database ingestion.
* **Built Event-Driven Firebase Utilities** utilizing `onSnapshot` real-time listeners and non-blocking asynchronous updates to eliminate thread blocks.
* **Designed a Debug-Optimized Error Architecture** featuring a custom `FirestorePermissionError` simulator and pub/sub `errorEmitter` singleton to catch, format, and report permission exceptions to Next.js global error boundaries.
* **Optimized Platform SEO & Discoverability** by leveraging server-rendered metadata queries (`generateMetadata`) and automatically injecting structured JSON-LD schemas representing catalog products conforming to Schema.org standards.
* **Formulated Declarative Security Access Rules** for Cloud Firestore and Storage buckets, ensuring granular write controls for authenticated admins while maintaining seamless public read access to store listings.
