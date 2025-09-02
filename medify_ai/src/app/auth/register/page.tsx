'use client'
import React from "react";
import AuthLayout from "../authLayout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";

// Define your Zod schema for validation
const formSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email({
    message: "field must be a valid email",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
});





const Page = () => {

    const {signUp} = useAuth()

    
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);

async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsSubmitting(true);
  setError(null);
  
  try {
    await signUp(values.first_name, values.last_name, values.email, values.password);
          } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
}

    // Set up the form hook with validation and default values
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });
  return (
    <AuthLayout>
        <CardContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center spacing-section w-full justify-center">
        <CardTitle className="text-center mb-4 text-heading-gradient">Sign Up</CardTitle>
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} className="form-input w-full" />
                </FormControl>
                <FormDescription>Enter your first name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} className="form-input w-full" />
                </FormControl>
                <FormDescription>Enter your last name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} className="form-input w-full" />
                </FormControl>
                <FormDescription>Enter your email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} className="form-input w-full" />
                </FormControl>
                <FormDescription>Enter a strong password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="form-button w-full bg-green-500 hover:bg-green-600"
          >
            {isSubmitting ? 'Creating Account...' : 'Submit'}
          </Button>
        </form>
      </Form>
        </CardContent>
        <CardFooter>
            <Link href={'/auth/login'} className="w-full text-center text-sm hover:underline">Existing User ? Sign in</Link>
        </CardFooter>
    </AuthLayout>
  );
};

export default Page;
