import { useEffect, useState } from "react";
import { SupplierDashboard } from "../essentialsforPage/Supplier";

export function SuppliersPage() {
    const [suppliers, setSuppliers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/suppliers", {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
                if (!response.ok) {
                    throw new Error("Failed to fetch suppliers");
                }
                const data = await response.json();
                setSuppliers(data.suppliers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return <SupplierDashboard suppliers={suppliers} />;
}