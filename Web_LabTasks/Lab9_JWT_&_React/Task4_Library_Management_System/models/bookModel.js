import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    isbn: String,
    resetToken: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
});

const Book = mongoose.model('Book', bookSchema);

export default Book;