import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddEditBookModal = ({ book, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publicationDate: '',
    publisher: '',
    pages: '',
    language: 'English',
    description: '',
    location: '',
    condition: 'Good',
    status: 'available',
    coverImage: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (book) {
      // Format publication date for input (YYYY-MM-DD)
      const pubDate = book?.publication_date 
        ? new Date(book.publication_date).toISOString().split('T')[0]
        : book?.publicationDate || '';
      
      setFormData({
        title: book?.title || '',
        author: book?.author || '',
        isbn: book?.isbn || '',
        category: book?.category || '',
        publicationDate: pubDate,
        publisher: book?.publisher || '',
        pages: book?.pages || '',
        language: book?.language || 'English',
        description: book?.description || '',
        location: book?.location || '',
        condition: book?.condition || 'Good',
        status: book?.status || 'available',
        coverImage: book?.cover_image || book?.coverImage || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        publicationDate: '',
        publisher: '',
        pages: '',
        language: 'English',
        description: '',
        location: '',
        condition: 'Good',
        status: 'available',
        coverImage: ''
      });
    }
    setErrors({});
  }, [book, isOpen]);

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'biography', label: 'Biography' },
    { value: 'children', label: 'Children\'s Books' },
    { value: 'reference', label: 'Reference' },
    { value: 'textbook', label: 'Textbooks' }
  ];

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Other', label: 'Other' }
  ];

  const conditionOptions = [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Poor', label: 'Poor' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'maintenance', label: 'Under Maintenance' }
  ];

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) newErrors.title = 'Title is required';
    if (!formData?.author?.trim()) newErrors.author = 'Author is required';
    if (!formData?.isbn?.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData?.category) newErrors.category = 'Category is required';
    if (!formData?.publicationDate) newErrors.publicationDate = 'Publication date is required';

    // ISBN format validation (basic)
    if (formData?.isbn && !/^[\d-]+$/?.test(formData?.isbn?.replace(/\s/g, ''))) {
      newErrors.isbn = 'Invalid ISBN format';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error after state update
      setTimeout(() => {
        const firstField = Object.keys(newErrors)[0];
        document.querySelector(`[data-field="${firstField}"]`)?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      }, 50);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Map to API format (snake_case for backend)
      const payload = {
        title: formData.title?.trim(),
        author: formData.author?.trim(),
        isbn: formData.isbn?.trim()?.replace(/\s/g, ''),
        category: formData.category,
        publication_date: formData.publicationDate ? new Date(formData.publicationDate) : null,
        publisher: formData.publisher?.trim() || undefined,
        pages: formData.pages ? parseInt(formData.pages, 10) : undefined,
        language: formData.language,
        description: formData.description?.trim() || undefined,
        location: formData.location?.trim() || undefined,
        condition: formData.condition,
        status: formData.status,
        cover_image: formData.coverImage?.trim() || undefined,
      };
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-card rounded-lg library-shadow-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <p className="font-medium">Please fix the following errors before saving:</p>
              <ul className="mt-1 list-disc list-inside text-sm">
                {Object.values(errors).map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Basic Information
              </h3>
              
              <div data-field="title">
                <Input
                  label="Title"
                  type="text"
                  placeholder="Enter book title"
                  value={formData?.title}
                  onChange={(e) => handleChange('title', e?.target?.value)}
                  error={errors?.title}
                  required
                />
              </div>

              <div data-field="author">
              <Input
                label="Author"
                type="text"
                placeholder="Enter author name"
                value={formData?.author}
                onChange={(e) => handleChange('author', e?.target?.value)}
                error={errors?.author}
                required
              />
              </div>

              <div data-field="isbn">
              <Input
                label="ISBN"
                type="text"
                placeholder="Enter ISBN (e.g., 978-0-123456-78-9)"
                value={formData?.isbn}
                onChange={(e) => handleChange('isbn', e?.target?.value)}
                error={errors?.isbn}
                required
              />
              </div>

              <div data-field="category">
              <Select
                label="Category"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleChange('category', value)}
                error={errors?.category}
                required
                placeholder="Select Category"
              />
              </div>

              <div data-field="publicationDate">
              <Input
                label="Publication Date"
                type="date"
                value={formData?.publicationDate}
                onChange={(e) => handleChange('publicationDate', e?.target?.value)}
                error={errors?.publicationDate}
                required
              />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Additional Details
              </h3>

              <Input
                label="Publisher"
                type="text"
                placeholder="Enter publisher name"
                value={formData?.publisher}
                onChange={(e) => handleChange('publisher', e?.target?.value)}
              />

              <Input
                label="Number of Pages"
                type="number"
                placeholder="Enter page count"
                value={formData?.pages}
                onChange={(e) => handleChange('pages', e?.target?.value)}
                min="1"
              />

              <Select
                label="Language"
                options={languageOptions}
                value={formData?.language}
                onChange={(value) => handleChange('language', value)}
              />

              <Input
                label="Library Location"
                type="text"
                placeholder="e.g., Section A, Shelf 3"
                value={formData?.location}
                onChange={(e) => handleChange('location', e?.target?.value)}
              />

              <Select
                label="Condition"
                options={conditionOptions}
                value={formData?.condition}
                onChange={(value) => handleChange('condition', value)}
              />

              <Select
                label="Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleChange('status', value)}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="mt-6">
            <Input
              label="Cover Image URL"
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={formData?.coverImage}
              onChange={(e) => handleChange('coverImage', e?.target?.value)}
              description="Enter a URL to the book cover image"
            />
            {formData?.coverImage && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div className="w-32 h-48 border border-border rounded-lg overflow-hidden bg-muted">
                  <img
                    src={formData.coverImage}
                    alt="Book cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows="4"
              placeholder="Enter book description (optional)"
              value={formData?.description}
              onChange={(e) => handleChange('description', e?.target?.value)}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName={book ? 'Save' : 'Plus'}
              iconPosition="left"
            >
              {book ? 'Update Book' : 'Add Book'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditBookModal;