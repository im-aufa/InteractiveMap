// src/components/CustomPopup.tsx

type CustomPopupProps = {
  placeName: string;
  imageUrl: string;
  detailsUrl: string;
};

const CustomPopup = ({ placeName, imageUrl, detailsUrl }: CustomPopupProps) => {
  return (
    <div className="w-64">
      <img src={imageUrl} alt={placeName} className="h-32 w-full rounded-lg object-cover" />
      <div className="mt-2">
        <h3 className="text-lg font-bold text-zinc-800">{placeName}</h3>
        <p className="mt-1 text-sm text-zinc-600">
          This is a custom popup with more information and interactive elements.
        </p>
        <a
          href={detailsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-700"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

export default CustomPopup;
