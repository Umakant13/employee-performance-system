/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Typography,
  Box,
  Alert,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Close,
  Send,
  Star,
  Person,
  Email,
  Business,
} from '@mui/icons-material';
import { feedbackAPI } from '../services/api';

const FeedbackModal = ({ open, onClose, employee, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 4,
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.comments.trim()) {
      setError('Please add some feedback comments');
      return;
    }

    setLoading(true);

    try {
      await feedbackAPI.create({
        employee_id: employee.id,
        rating: formData.rating,
        comments: formData.comments,
      });

      // Reset form
      setFormData({ rating: 4, comments: '' });
      
      // Call success callback
      if (onSuccess) onSuccess();
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.response?.data?.detail || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ rating: 4, comments: '' });
    setError('');
    onClose();
  };

  if (!employee) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Star sx={{ mr: 1, fontSize: 30 }} />
          <Typography variant="h6" fontWeight="bold">
            Add Feedback
          </Typography>
        </Box>
        <Button
          onClick={handleClose}
          sx={{ color: 'white', minWidth: 'auto' }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        {/* Employee Info */}
        <Box
          sx={{
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 50,
                height: 50,
              }}
            >
              {employee.name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {employee.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Email />}
                  label={employee.email}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<Business />}
                  label={employee.department}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Performance Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, rating: newValue });
                }}
                size="large"
                precision={0.5}
              />
              <Typography variant="h6" color="primary" fontWeight="bold">
                {formData.rating}/5
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Rate the employee's recent performance
            </Typography>
          </Box>

          {/* Comments */}
          <Box>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              Feedback Comments
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Provide detailed feedback on performance, achievements, areas for improvement, etc."
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Be specific and constructive in your feedback
            </Typography>
          </Box>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button onClick={handleClose} variant="outlined" size="large">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={<Send />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            px: 3,
          }}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
