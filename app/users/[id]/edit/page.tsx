import UserFormComponent from "@/components/UserFormComponent";

export default function UpdateUser({ params }: { params: { id: number } }) {
  return (
    <UserFormComponent userId={params.id} editionMode={true} />
  )
}