import AdminLayout from "@/components/layouts/AdminLayout";
import TeamTerbitPage from "@/components/partials/adminPartials/terbit-profile/team-terbit";

const TeamTerbit = () => {
  return (
    <>
    <AdminLayout>
      <div className="flex-1 space-y-4 px-4 py-4 sm:px-6 md:px-8">
        <TeamTerbitPage />
      </div>
    </AdminLayout>

    </>
  )
}

export default TeamTerbit;