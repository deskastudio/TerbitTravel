// User type definition
export type User = {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional as it's not always included in responses
    alamat?: string; // Optional as it wasn't displayed in the main table
    noTelp?: string; // Optional as it wasn't displayed in the main table
    instansi: string;
    foto?: string; // Optional as it wasn't displayed in the main table
    status: UserStatus;
  };
  
  // User status type
  export type UserStatus = 'verified' | 'unverified' | 'incomplete_profile';
  
  // Form data types
  export type UserFormData = Omit<User, 'id'>;
  
  export type AddUserFormData = Omit<UserFormData, 'status'> & { status: UserStatus };
  
  export type EditUserFormData = Omit<UserFormData, 'password'>;
  
  // Props types for components
  export type AddUserFormProps = {
    onSubmit: (data: AddUserFormData) => void;
  };
  
  export type EditUserFormProps = {
    user: User;
    onSubmit: (data: EditUserFormData) => void;
  };
  
  export type UserDetailsProps = {
    user: User;
  };
  
  // Filter and search types
  export type UserFilter = {
    searchTerm: string;
    statusFilter: UserStatus | 'all';
  };
  