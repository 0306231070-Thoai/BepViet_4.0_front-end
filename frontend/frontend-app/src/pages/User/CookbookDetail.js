import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CookbookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cookbook, setCookbook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://127.0.0.1:8000/api/cookbooks/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                const result = await res.json();
                if (res.ok) setCookbook(result.data);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="cookbook-detail">
            <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
                &larr; Quay lại
            </button>
            <h4 className="fw-bold">{cookbook?.name}</h4>
            <p className="text-muted">{cookbook?.description}</p>
            <hr />
            <div className="row g-3">
                {cookbook?.recipes?.map(recipe => (
                    <div className="col-md-4" key={recipe.id}>
                        <div className="card border-0 shadow-sm rounded-3 overflow-hidden h-100">
                            <img src={recipe.image_url} className="card-img-top" alt={recipe.title} style={{ height: '150px', objectFit: 'cover' }} />
                            <div className="card-body p-2">
                                <h6 className="small fw-bold mb-0 text-truncate">{recipe.title}</h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CookbookDetail;