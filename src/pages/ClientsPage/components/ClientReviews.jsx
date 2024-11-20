import React from 'react'

function ClientReviews({ reviews = [] }) {
  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      orderId: '1001',
      date: '2024-01-15',
      rating: 5,
      comment: 'Beautiful flowers, exactly what I wanted!',
      bouquet: 'Rose Bouquet'
    },
    {
      id: 2,
      orderId: '1002',
      date: '2024-01-10',
      rating: 4,
      comment: 'Nice arrangement, delivery was a bit late',
      bouquet: 'Spring Mix'
    }
  ]

  const displayReviews = reviews.length > 0 ? reviews : mockReviews

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-4">Client Reviews</h2>
      <div className="space-y-4">
        {displayReviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{review.bouquet}</div>
                <div className="text-sm text-gray-500">Order #{review.orderId}</div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientReviews
