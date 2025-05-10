import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormValues {
  email: string;
  full_name: string;
  role: "admin" | "user";
}

interface UserFormProps {
  initialData?: {
    id: string;
    email: string;
    full_name: string | null;
    role: "admin" | "user";
  };
  onSuccess: () => void;
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UserFormValues>({
    defaultValues: {
      email: initialData?.email || "",
      full_name: initialData?.full_name || "",
      role: initialData?.role || "user",
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);
    try {
      if (initialData) {
        // Update existing user
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            email: values.email,
            full_name: values.full_name,
          })
          .eq("id", initialData.id);

        if (profileError) throw profileError;

        const { error: roleError } = await supabase
          .from("user_roles")
          .update({
            role: values.role,
          })
          .eq("user_id", initialData.id);

        if (roleError) throw roleError;

        toast.success("User updated successfully");
      } else {
        // Create new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: Math.random().toString(36).slice(-8), // Generate random password
          options: {
            data: {
              full_name: values.full_name,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .update({ role: values.role })
            .eq("user_id", authData.user.id);

          if (roleError) throw roleError;
        }

        toast.success("User created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(initialData ? "Failed to update user" : "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled={!!initialData} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update User" : "Create User"}
        </Button>
      </form>
    </Form>
  );
}