import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { CompanyInfo, companyInfoSchema } from '@/types/about';
import { getCompanyInfo, updateCompanyInfo } from '@/lib/api';

const AboutTerbitPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CompanyInfo>({
    resolver: zodResolver(companyInfoSchema),
  });

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const data = await getCompanyInfo();
      setCompanyInfo(data);
      reset(data);
    };
    fetchCompanyInfo();
  }, [reset]);

  const onSubmit = async (data: CompanyInfo) => {
    try {
      await updateCompanyInfo(data);
      setCompanyInfo(data);
      setIsEditing(false);
      toast({
        title: "Company information updated",
        description: "Your changes have been saved successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update company information. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!companyInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">About Our Company</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="description"
                disabled={!isEditing}
                className="mt-1 block w-full"
                rows={4}
              />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="vision" className="block text-sm font-medium text-gray-700">Vision</label>
          <Controller
            name="vision"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="vision"
                disabled={!isEditing}
                className="mt-1 block w-full"
              />
            )}
          />
          {errors.vision && <p className="text-red-500 text-sm mt-1">{errors.vision.message}</p>}
        </div>
        <div>
          <label htmlFor="mission" className="block text-sm font-medium text-gray-700">Mission</label>
          <Controller
            name="mission"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="mission"
                disabled={!isEditing}
                className="mt-1 block w-full"
              />
            )}
          />
          {errors.mission && <p className="text-red-500 text-sm mt-1">{errors.mission.message}</p>}
        </div>
        {isEditing ? (
          <Button type="submit">Save Changes</Button>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </form>
    </div>
  );
};

export default AboutTerbitPage;

