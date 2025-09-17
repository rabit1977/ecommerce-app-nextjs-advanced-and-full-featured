'use client';

import { Button } from '@/components/ui/button';
import { Stars } from '@/components/ui/stars';
import { useAuth } from '@/lib/hooks/useAuth';
import { Review } from '@/lib/types';
import { Pencil, ThumbsUp, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AddReviewForm } from './add-review-form';
import { useAppDispatch } from '@/lib/store/hooks';
import { toggleHelpfulReview, deleteReview } from '@/lib/store/thunks/managementThunks';
import { cn } from '@/lib/utils';

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
}

const ReviewsSection = ({ productId, reviews }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const userReview = useMemo(() => {
    if (!user) return null;
    return reviews.find(review => review.author === user.name);
  }, [reviews, user]);

  const handleEditClick = () => {
    setEditingReview(userReview);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleToggleHelpful = (reviewId: string) => {
    dispatch(toggleHelpfulReview(productId, reviewId));
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      dispatch(deleteReview(productId, reviewId));
    }
  };

  const canShowAddForm = user && !userReview && !editingReview;

  return (
    <div className='mt-12 py-8 border-t dark:border-slate-800'>
      <div className="flex justify-between items-center">
        <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Customer Reviews
        </h2>
        {user && userReview && !editingReview && (
            <div className="flex items-center gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">You have already reviewed this product.</p>
                <Button variant="outline" size="sm" onClick={handleEditClick}><Pencil className="mr-2 h-4 w-4"/>Edit Your Review</Button>
            </div>
        )}
      </div>

      {canShowAddForm && (
        <AddReviewForm
          productId={productId}
          reviewToEdit={null}
          onCancelEdit={handleCancelEdit}
        />
      )}
      
      {editingReview && (
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
          reviews.map((review) => {
            const isHelpful = user?.helpfulReviews?.includes(review.id);
            const isUserReview = user && user.name === review.author;
            return (
              <div key={review.id} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200'>
                  {(review.author || '?').charAt(0)}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-2">
                      <h4 className='font-semibold text-slate-900 dark:text-white'>
                        {review.author || 'Anonymous'}
                      </h4>
                      <Stars value={review.rating} />
                    </div>
                    {isUserReview && !editingReview && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleDeleteReview(review.id)}
                                className='flex items-center gap-1 text-sm text-red-500 hover:text-red-600'
                            >
                                <Trash2 className='h-4 w-4' />
                                <span>Delete</span>
                            </Button>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleEditClick(review)}
                                className='flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400'
                            >
                                <Pencil className='h-4 w-4' />
                                <span>Edit</span>
                            </Button>
                        </div>
                    )}
                  </div>
                  <h5 className="font-medium mt-1 dark:text-slate-300">{review.title}</h5>
                  <p className='mt-2 text-slate-600 dark:text-slate-300'>
                    {review.comment}
                  </p>
                  <div className='flex items-center mt-2 text-sm text-slate-500 dark:text-slate-400'>
                    <button
                      onClick={() => handleToggleHelpful(review.id)}
                      disabled={isUserReview} // Disable helpful button on user's own review
                      className={cn(
                        'flex items-center gap-1 transition-colors',
                        !isUserReview && 'hover:text-slate-900 dark:hover:text-white',
                        isHelpful && 'text-blue-600 dark:text-blue-400',
                        isUserReview && 'cursor-not-allowed opacity-60'
                      )}
                    >
                      <ThumbsUp className={cn('h-4 w-4', isHelpful && 'fill-current')} />
                      <span>Helpful ({review.helpful || 0})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export { ReviewsSection };
