import { UserDetailsProps } from '@/types/User';

const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Name</h3>
        <p>{user.name}</p>
      </div>
      <div>
        <h3 className="font-semibold">Email</h3>
        <p>{user.email}</p>
      </div>
      <div>
        <h3 className="font-semibold">Instansi</h3>
        <p>{user.instansi}</p>
      </div>
      <div>
        <h3 className="font-semibold">Status</h3>
        <p>{user.status}</p>
      </div>
    </div>
  );
};

export default UserDetails;
