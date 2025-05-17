import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  getCurrentUser,
  updateUserProfile,
  updateUserPreferences,
} from "@/services/storage";
import type { User } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email").min(1, "Email is required"),
  preferences: z.object({
    preferredCategories: z.array(z.string()),
    notifications: z.boolean(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      preferences: {
        preferredCategories: [],
        notifications: false,
      },
    },
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      form.reset({
        name: currentUser.name,
        email: currentUser.email,
        preferences: {
          preferredCategories:
            currentUser.preferences?.preferredCategories || [],
          notifications: currentUser.preferences?.notifications || false,
        },
      });
    }
  }, [form]);

  const onSubmit = (values: FormValues) => {
    try {
      if (user) {
        const updatedUser: User = {
          ...user,
          ...values,
        };
        updateUserProfile(updatedUser);
        updateUserPreferences(updatedUser.preferences);
        setUser(updatedUser);
        setSuccess("Profile updated successfully");
        setTimeout(() => {
          setSuccess("");
        }, 3000);
        setError("");
      }
    } catch (err) {
      setError("Failed to update profile");
      setSuccess("");
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {error && (
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-500/15 p-4 text-green-500">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferences.notifications"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">
                      Receive email notifications
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
