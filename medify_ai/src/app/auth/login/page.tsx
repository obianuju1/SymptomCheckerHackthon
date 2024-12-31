"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthLayout from "../authLayout";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useContext } from "react";
import { useAuth} from "../../../../context/AuthContext";
// Validation schema with Zod
const FormSchema = z.object({
  email: z.string().email({ message: "email must be valid fromat" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
});

export default function Login() {
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering
  const [loginError,setLoginError] = useState("")
  const { login } = useAuth() 
  
  // useEffect to set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Form setup with react-hook-form and Zod validation
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submit handler
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),


    });

    try {
      await login(data.email,data.password)
    } catch (error: any) {
      console.log(error.message)
      setLoginError(error.message)
    }

    
  }

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  return (
    <AuthLayout>
      {/* Form container */}
      <CardContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6 w-full justify-center"
        >
          {/* Login Title */}
          <CardTitle className="text-2xl font-bold text-center mb-4">Login</CardTitle>

          {/* Username Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email"
                    {...field}
                    className="w-72" // Adjust the width of the input box
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter password"
                    type="password"
                    {...field}
                    className="w-72 text-white" // Adjust the width of the input box
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-40 bg-green-500 hover:bg-green-500">
            Login
          </Button>
        </form>
      </Form>
      {loginError && <p className="w-full text-center text-sm text-red-600 mt-2">error logging in user</p>}
      </CardContent>
      <CardFooter>
        <Link href={'/auth/register'} className="w-full text-center hover:underline text-sm ">New User ? Sign up</Link>
        </CardFooter>
      </AuthLayout>
  );
}
