// frontend/app/scheme-support/components/SchemeResults.tsx

type Scheme = {
  id: number;
  name: string;
  description: string;
  type: string;
  benefits: string;
  links?: string;
};

export default function SchemeResults({ schemes }: { schemes: Scheme[] }) {
  if (!schemes.length) return <p className="text-red-600">No schemes matched your details.</p>;

  return (
    <div className="p-4 space-y-4">
      {schemes.map((scheme) => (
      // Inside .map loop
      <div key={scheme.id} className="border border-pink-200 p-5 rounded-2xl shadow-sm bg-pink-50 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-xl font-bold text-pink-800 mb-1">{scheme.name}</h2>
        <p className="text-sm text-gray-700"><strong>Type:</strong> <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">{scheme.type}</span></p>
        <p className="mt-2 text-sm text-gray-800"><strong>Description:</strong> {scheme.description}</p>
        <p className="text-sm text-gray-800"><strong>Benefits:</strong> {scheme.benefits}</p>
        {scheme.links && (
          <p className="mt-2">
            <a href={scheme.links} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              🔗 Learn more
            </a>
          </p>
        )}
      </div>
      ))}
    </div>
  );
}