import { getPropertiesByCategory } from "@/data/properties"

interface PropertiesLayoutProps {
  category: string
}

export default async function PropertiesLayout({ category }: PropertiesLayoutProps) {
  const properties = await getPropertiesByCategory(category)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">{category} Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold">{property.title}</h2>
            <p className="text-gray-600">{property.location}</p>
            <p className="text-gray-800">${property.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
