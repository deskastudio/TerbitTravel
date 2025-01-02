import AdminLayout from "@/components/layouts/AdminLayout";
import TourPackageEditForm from "@/components/partials/adminPartials/tourPackage/[id]/edit-tour-package"
import { useParams } from 'react-router-dom';

// In a real application, you would fetch this data from your API
const mockTourPackage = {
  id: '1',
  name: 'Bali Adventure',
  description: 'Explore the beautiful island of Bali',
  includes: ['Hotel', 'Breakfast'],
  excludes: ['Flights'],
  price: 1000000,
  duration: '3 days',
  schedules: [{ startDate: '2023-08-01', endDate: '2023-08-03' }],
  destination: 'Bali',
  hotel: 'Bali Resort',
  fleet: 'Minibus',
  consume: 'breakfast',
  status: 'available'
}

const EditTourPackage = () => {
  const { id } = useParams();
  const tourPackage = mockTourPackage;

  return (
    <>
    <AdminLayout>
      <TourPackageEditForm tourPackage={tourPackage} />
    </AdminLayout>
    </>
    
  )
}

export default EditTourPackage;

