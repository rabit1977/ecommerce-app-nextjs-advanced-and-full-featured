'use client';

import { Stars } from '@/components/ui/stars';
import { useApp } from '@/lib/context/app-context';
import { Review } from '@/lib/types';
import { ThumbsUp, Pencil } from 'lucide-react';
import { AddReviewForm } from './add-review-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
}

const ReviewsSection = ({ productId, reviews }: ReviewsSectionProps) => {
  const { user, updateReviewHelpfulCount } = useApp();
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
  };
  
  const handleCancelEdit = () => {
    setEditingReview(null);
  };
  

  return (
    <div className='mt-12 py-8 border-t dark:border-slate-800'>
      <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white'>
        Customer Reviews
      </h2>

      {user && (
        <AddReviewForm 
          productId={productId} 
          reviewToEdit={editingReview}
          onCancelEdit={handleCancelEdit}
        />
      )}

      <div className='mt-6 space-y-8'>
        {reviews.length === 0 ? (
          <p className='mt-4 text-slate-500 dark:text-slate-400'>
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-shrink-0 w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200'>
                {review.name.charAt(0)}
              </div>
              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <h4 className='font-semibold text-slate-900 dark:text-white'>
                    {review.name}
                  </h4>
                  <Stars value={review.rating} />
                </div>
                <p className='mt-2 text-slate-600 dark:text-slate-300'>
                  {review.comment}
                </p>
                <div className='flex items-center mt-2 text-sm text-slate-500 dark:text-slate-400'>
                  <button
                    onClick={() =>
                      updateReviewHelpfulCount(productId, review.id)
                    }
                    className='flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors'
                  >
                    <ThumbsUp className='h-4 w-4' />
                    <span>Helpful ({review.helpful || 0})</span>
                  </button>
                  {/* NEW: Edit button for the user's own review */}
                  {user && user.name === review.name && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(review)}
                      className="ml-2 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"
                    >
                      <Pencil className='h-4 w-4' />
                      <span>Edit</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { ReviewsSection };
