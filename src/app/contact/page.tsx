import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="bg-card py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Get in Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a question or a special request? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
