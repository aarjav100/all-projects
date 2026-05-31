import api from './api';

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  googleAuth: (data: { googleId: string; email: string; name: string; avatar?: string }) =>
    api.post('/auth/google', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  verifyOtp: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-otp', data),

  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refreshToken }),
};

export const userService = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: any) => api.patch('/users/me', data),
  uploadAvatar: (formData: FormData) =>
    api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getPublicProfile: (id: string) => api.get(`/users/${id}`),
  getWishlists: () => api.get('/users/me/wishlists'),
  createWishlist: (name: string) => api.post('/users/me/wishlists', { name }),
  updateWishlist: (id: string, name: string) => api.patch(`/users/me/wishlists/${id}`, { name }),
  deleteWishlist: (id: string) => api.delete(`/users/me/wishlists/${id}`),
  toggleWishlistListing: (wishlistId: string, listingId: string) =>
    api.post(`/users/me/wishlists/${wishlistId}/listings/${listingId}`),
  becomeHost: () => api.patch('/users/me/become-host'),
};

export const listingService = {
  getListings: (params?: any) => api.get('/listings', { params }),
  getListing: (id: string) => api.get(`/listings/${id}`),
  createListing: (data: any) => api.post('/listings', data),
  updateListing: (id: string, data: any) => api.patch(`/listings/${id}`, data),
  deleteListing: (id: string) => api.delete(`/listings/${id}`),
  getAvailability: (id: string) => api.get(`/listings/${id}/availability`),
  updateAvailability: (id: string, data: any) => api.patch(`/listings/${id}/availability`, data),
  getMyListings: () => api.get('/listings/host/me'),
};

export const bookingService = {
  createBooking: (data: any) => api.post('/bookings', data),
  getGuestBookings: (status?: string) => api.get('/bookings/guest/me', { params: { status } }),
  getHostBookings: (status?: string) => api.get('/bookings/host/me', { params: { status } }),
  getBooking: (id: string) => api.get(`/bookings/${id}`),
  cancelBooking: (id: string, reason?: string) => api.patch(`/bookings/${id}/cancel`, { reason }),
  confirmBooking: (id: string) => api.patch(`/bookings/${id}/confirm`),
};

export const reviewService = {
  createReview: (data: any) => api.post('/reviews', data),
  getListingReviews: (listingId: string, params?: any) =>
    api.get(`/reviews/listing/${listingId}`, { params }),
  replyToReview: (id: string, reply: string) => api.patch(`/reviews/${id}/reply`, { reply }),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

export const messageService = {
  getConversations: () => api.get('/conversations'),
  createConversation: (participantId: string, listingId?: string) =>
    api.post('/conversations', { participantId, listingId }),
  getMessages: (conversationId: string, params?: any) =>
    api.get(`/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId: string, content: string, type?: string) =>
    api.post(`/conversations/${conversationId}/messages`, { content, type }),
};

export const paymentService = {
  createPaymentIntent: (bookingId: string) =>
    api.post('/payments/create-intent', { bookingId }),
  confirmPayment: (paymentIntentId: string) =>
    api.post('/payments/confirm', { paymentIntentId }),
  getPaymentHistory: () => api.get('/payments/history'),
};

export const notificationService = {
  getNotifications: (params?: any) => api.get('/notifications', { params }),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};
