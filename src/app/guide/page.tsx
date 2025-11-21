import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Building,
  Settings,
  Mail,
  BookOpen,
  ListPlus,
  Palette,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <BookOpen className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-4xl md:text-5xl font-headline font-bold text-primary">
            Owner&apos;s Guide
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Welcome! This guide will help you manage your website effectively.
          </p>
        </div>

        <div className="space-y-12">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Creating an Admin Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To secure your admin panel, you need to create a dedicated user account directly in your Firebase project.
              </p>
              <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-foreground mb-2">Step-by-Step Instructions</h3>
                    <div className="space-y-2 pl-4">
                        <p><strong>Step 1:</strong> Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Console</a> and select your project.</p>
                        <p><strong>Step 2:</strong> In the left-hand navigation menu, click on <strong>Build &gt; Authentication</strong>.</p>
                        <p><strong>Step 3:</strong> Go to the <strong>Sign-in method</strong> tab and ensure the <strong>Email/Password</strong> provider is enabled.</p>
                        <p><strong>Step 4:</strong> Go to the <strong>Users</strong> tab and click the <strong>Add user</strong> button.</p>
                        <p><strong>Step 5:</strong> Enter the email address and a secure password for your admin account, then click <strong>Add user</strong>.</p>
                        <p><strong>Step 6:</strong> Once created, you can use these credentials to log in to your admin panel at <Link href="/login" className="text-primary hover:underline" target="_blank" prefetch={false}>yourwebsite.com/login</Link>.</p>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-6 w-6" />
                Accessing Your Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Your admin panel is the central hub for managing your
                website&apos;s content.
              </p>
              <div className="space-y-2">
                <p><strong>Step 1:</strong> To access it, simply add{' '}
                  <code className="font-code bg-muted px-1 py-0.5 rounded-sm">
                    /login
                  </code>{' '}
                  to the end of the website&apos;s URL.</p>
                <p><strong>Step 2:</strong> For example:{' '}
                  <Link
                    href="/login"
                    className="text-primary hover:underline font-code"
                    target="_blank"
                    prefetch={false}
                  >
                    yourwebsite.com/login
                  </Link>
                </p>
                <p><strong>Step 3:</strong> You will be automatically signed in to the admin panel.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6" />
                Managing Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The &quot;Products&quot; section lets you add, edit, and delete items in
                your collection.
              </p>
              <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-foreground mb-2">Adding a New Product</h3>
                    <div className="space-y-2 pl-4">
                        <p><strong>Step 1:</strong> Navigate to the <Link href="/admin/products" className="text-primary hover:underline" target="_blank" prefetch={false}>Products</Link> page and click the "Add Product" button.</p>
                        <p><strong>Step 2:</strong> Use the "Featured Product" toggle at the top of the form if you want this item to appear on the homepage.</p>
                        <p><strong>Step 3:</strong> Fill in the product&apos;s Name, Price (optional), Category, and Brand (optional).</p>
                        <p><strong>Step 4:</strong> Write a concise "Short Description" for product cards and a more detailed "Full Description" for the product page.</p>
                        <p><strong>Step 5:</strong> Add technical details like Material, Dimensions, and Origin in the "Specifications" section.</p>
                        <p><strong>Step 6:</strong> You must add at least one image. For each image, provide a URL and a description for accessibility.</p>
                        <p><strong>Step 7:</strong> Click the "Save Product" button at the bottom to create the new product.</p>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground mb-2">Editing and Deleting Products</h3>
                    <div className="space-y-2 pl-4">
                         <p><strong>Step 1:</strong> On the products table, click the three-dots menu next to the product you want to manage.</p>
                         <p><strong>Step 2:</strong> Select "Edit" to open the form and make changes, or "Delete" to permanently remove the product. You can also select "View" to see the live product page.</p>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6" />
                Viewing Contact Form Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                View all messages sent through your contact form in the &quot;Submissions&quot; section.
              </p>
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Navigate to the <Link href="/admin/submissions" className="text-primary hover:underline" target="_blank" prefetch={false}>Submissions</Link> page. You will see a table of all messages.</p>
                <p><strong>Step 2:</strong> To read a full message, click the three-dots menu on any submission and select &quot;View&quot;. This will show all the details, including any custom field information.</p>
                <p><strong>Step 3:</strong> To remove a submission, click the three-dots menu and select &quot;Delete&quot;. This action is permanent and will ask for confirmation.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-6 w-6" />
                Managing Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Organize your products into categories and sub-categories to help customers browse.
              </p>
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Go to the <Link href="/admin/categories" className="text-primary hover:underline" target="_blank" prefetch={false}>Categories</Link> page and click &quot;Add Category&quot;.</p>
                <p><strong>Step 2:</strong> Give the category a name. To create a sub-category, select a &quot;Parent Category&quot; from the dropdown menu.</p>
                <p><strong>Step 3:</strong> To edit a category, use the &quot;Edit&quot; option from the actions menu. To delete one, select "Delete".</p>
                <p><strong>Important:</strong> You cannot delete a category that is a parent to other categories. You must first re-assign or delete its sub-categories.</p>
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6" />
                Managing Brands
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Showcase the brands you carry. Each brand gets its own dedicated page on your site.
              </p>
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Go to the <Link href="/admin/brands" className="text-primary hover:underline" target="_blank" prefetch={false}>Brands</Link> page and click &quot;Add Brand&quot;.</p>
                <p><strong>Step 2:</strong> Add a name, a descriptive paragraph, and a URL for the brand&apos;s logo.</p>
                <p><strong>Step 3:</strong> When you enter a URL in the logo field, a small preview will appear so you can confirm it&apos;s correct before saving.</p>
                 <p><strong>Step 4:</strong> Use the &quot;Edit&quot; or "Delete" options from the actions menu to manage existing brands.</p>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListPlus className="h-6 w-6" />
                Managing Contact Form Fields
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                You can add custom fields to your contact form to gather
                more specific information from your customers.
              </p>
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Go to the <Link href="/admin/custom-fields" className="text-primary hover:underline" target="_blank" prefetch={false}>Form Fields</Link> section and click &quot;Add Field&quot;.</p>
                <p><strong>Step 2:</strong> Give the field a `Label` (what users see), a `Type` (single line of text or a larger text area), and specify if it&apos;s `Required`.</p>
                <p><strong>Step 3:</strong> A unique machine-readable `name` for the field is generated automatically from the label. This cannot be changed later.</p>
                <p><strong>Step 4:</strong> New fields will automatically appear on your public-facing contact form above the message box.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Configure global settings for your application from the "Settings" page.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>WhatsApp Number:</strong> Set the number for the
                  &quot;Buy via WhatsApp&quot; button on product pages.
                </li>
                 <li>
                  <strong>About Us Image:</strong> Add or update the URL for the image that appears in the &quot;About Us&quot; section on the homepage.
                </li>
                 <li>
                  <strong>Homepage Sections:</strong> Control the visibility of the main sections on your homepage (Hero and Products) using the toggle switches.
                </li>
                 <li>
                  <strong>Theme Customization:</strong> Change your website's colors using the color pickers. See the section below for more details.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-6 w-6" />
                Customizing Your Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The &quot;Settings&quot; page allows you to customize the color scheme of your website to match your brand. The changes are reflected in real-time in the &quot;Live Preview&quot; section.
              </p>
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Navigate to the <Link href="/admin/settings" className="text-primary hover:underline" target="_blank" prefetch={false}>Settings</Link> page in your admin panel.</p>
                <p><strong>Step 2:</strong> Scroll down to the &quot;Theme&quot; area where you&apos;ll find the color pickers.</p>
                <p><strong>Step 3:</strong> Use the color pickers for each of the following settings:</p>
                <ul className="list-disc list-inside space-y-1 pl-6">
                    <li><strong>Foreground Color:</strong> This controls the color of your main body text.</li>
                    <li><strong>Muted Text Color:</strong> This controls the color for secondary text, like descriptions and subtitles.</li>
                    <li><strong>Primary Color:</strong> This is used for main headings, links, and important buttons.</li>
                    <li><strong>Accent Color:</strong> This color is used for highlights, badges, and secondary calls-to-action.</li>
                </ul>
                <p><strong>Step 4:</strong> If you want to go back to the default theme, click the &quot;Reset Colors&quot; button.</p>
                <p><strong>Step 5:</strong> Once you are happy with your new color scheme, click the &quot;Save Settings&quot; button at the bottom of the page to apply the changes.</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
