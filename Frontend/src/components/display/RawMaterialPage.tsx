import { useEffect, useState } from "react";
import { RawMaterialDashboard } from "../essentialsforPage/RawMaterial";

export function RawMaterialPage() {
    const [materials, setMaterials] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/rawmaterial", {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
                if (!response.ok) {
                    throw new Error("Failed to fetch raw materials");
                }
                const data = await response.json();
                setMaterials(data.rawMaterials);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return <RawMaterialDashboard materials={materials} />;
}