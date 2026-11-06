'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { fetchAdminApi } from '../../../lib/api';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    setIsLoading(true);
    const res = await fetchAdminApi<any[]>('/reviews/admin/list');
    if (res.success && res.data) {
      setReviews(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSetApproval = async (id: string, isApproved: boolean) => {
    await fetchAdminApi(`/reviews/admin/${id}/approval`, {
      method: 'PUT',
      body: JSON.stringify({ isApproved }),
    });
    loadReviews();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this review permanently?')) {
      await fetchAdminApi(`/reviews/admin/${id}`, { method: 'DELETE' });
      loadReviews();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#191714]">Product Reviews Moderation</h1>
        <p className="text-xs text-[#746D62] mt-0.5">Approve, reject, or moderate real customer feedback</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#746D62]">Loading reviews...</div>
        ) : reviews.length > 0 ? (
          <div className="divide-y divide-[#E8DFD0]/60 text-xs">
            {reviews.map((r) => (
              <div key={r.id} className="p-5 flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-[#FAF6F0]">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#191714]">{r.authorName}</span>
                    <span className="text-[#746D62]">on</span>
                    <span className="font-serif font-semibold text-[#003D2D]">{r.product?.name}</span>
                  </div>
                  <div className="flex text-[#C9A34A]">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-[#746D62] pt-1 leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                  <p className="text-[10px] text-[#746D62] pt-1">
                    Submitted: {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {r.isApproved ? (
                    <button
                      onClick={() => handleSetApproval(r.id, false)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold"
                    >
                      <XCircle size={14} />
                      <span>Unapprove</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSetApproval(r.id, true)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded font-semibold"
                    >
                      <CheckCircle size={14} />
                      <span>Approve</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Delete Review"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#746D62]">
            <p className="font-serif text-base font-semibold text-[#191714]">No Customer Reviews Yet</p>
            <p className="mt-1">When buyers submit product reviews, they will appear here for verification.</p>
          </div>
        )}
      </div>
    </div>
  );
}
