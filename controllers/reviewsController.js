const Review = require('../models/mongodb/reviews');
const mongoose = require('mongoose');

const addReview = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.error('MongoDB not connected. Connection state:', mongoose.connection.readyState);
            return res.status(500).json({
                success: false,
                message: 'Database connection error'
            });
        }

        console.log('Starting review addition...');
        console.log('Request body:', req.body);

        const { userId, username, rating, comment } = req.body;

        if (!userId || !username || !rating || !comment) {
            console.error('Missing required fields:', { userId, username, rating, comment });
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newReview = new Review({
            userId: userId.toString(),
            username,
            rating: parseInt(rating),
            comment: comment.trim()
        });

        console.log('Attempting to save review:', newReview);

        const savedReview = await newReview.save();

        if (!savedReview) {
            console.error('Save operation failed silently');
            return res.status(500).json({
                success: false,
                message: 'Failed to save review'
            });
        }

        console.log('Review saved successfully:', savedReview);

        return res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review: savedReview
        });

    } catch (error) {
        console.error('Error in addReview:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        
        return res.status(500).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
};

const getReviews = async (req, res) => {
    try {
        console.log('Fetching reviews from database...');
        const reviews = await Review.find()
            .sort({ createdAt: -1 }); 
        
        console.log('Retrieved reviews:', reviews);  // Add this log
        
        res.status(200).json({
            success: true,
            reviews: reviews  // Make sure we're sending the reviews array
        });
     } catch (error) {
        console.error('Error in getReviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { userId } = req.body; 
        
        const review = await Review.findOne({ _id: reviewId });
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        
        if (review.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await Review.findByIdAndDelete(reviewId);
        
        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};

module.exports = {
    addReview,
    getReviews,
    deleteReview
};
