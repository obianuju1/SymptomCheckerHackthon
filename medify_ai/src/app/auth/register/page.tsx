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
import { useState,useEffect } from "react";
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
    const [isClient, setIsClient] = useState(false); // State to track client-side rendering
    const {signUp} = useAuth()

    
function onSubmit(values: z.infer<typeof formSchema>) {
  console.log(values);
  // send sign-up info to the provider
  signUp(values.first_name, values.last_name, values.email, values.password)
}
  // useEffect to set isClient to true after the component mounts
    useEffect(() => {
        setIsClient(true);
    }, []);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-3">
        <CardTitle className="text-2xl font-bold text-center mb-4">Sign Up</CardTitle>
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
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
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
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
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormDescription>Enter a strong password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="block w-full bg-green-500 hover:bg-green-500">Submit</Button>
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
