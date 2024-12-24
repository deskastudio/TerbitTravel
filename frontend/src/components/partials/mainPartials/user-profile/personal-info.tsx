"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Define the schema using zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not exceed 500 characters.",
  }),
  address: z.string().max(250, {
    message: "Address must not exceed 250 characters.",
  }),
  profilePhoto: z.instanceof(FileList).refine((fileList) => fileList.length <= 1, {
    message: "Please upload only one photo.",
  }),
  institution: z.string().max(100, {
    message: "Institution name must not exceed 100 characters.",
  }),
});

// Define interface for default values
interface DefaultValues {
  name: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  profilePhoto: FileList | null;
  institution: string;
}

// Default values
const defaultValues: DefaultValues = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "1234567890",
  bio: "I'm a software developer with a passion for creating user-friendly applications.",
  address: "123 Main Street, Some City, Some Country",
  profilePhoto: null,
  institution: "Example University",
};

const PersonalInfo: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  // Initialize the form using react-hook-form
  const form = useForm<DefaultValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit: SubmitHandler<DefaultValues> = (values) => {
    console.log('Form values:', values);
    toast({
      title: "Profile Updated",
      description: "Your personal information has been updated successfully.",
    });
    setIsEditing(false);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedPhoto(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
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
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={!isEditing} />
                </FormControl>
                <FormDescription>
                  Tell us a little about yourself. Max 500 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Profile Photo</FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name="profilePhoto"
                render={({ field }) => (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      handleFileChange(e);
                    }}
                    disabled={!isEditing}
                  />
                )}
              />
            </FormControl>
            <FormMessage />
            {/* Display the selected photo */}
            {selectedPhoto && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(selectedPhoto)}
                  alt="Selected Photo"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
          </FormItem>
          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEditing && (
            <Button type="submit">Save Changes</Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default PersonalInfo;
