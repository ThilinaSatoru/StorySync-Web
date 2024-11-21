import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createTag, updateTag, deleteTag, getAllTags } from '@/services/tagService';
import { createAuthor, updateAuthor, deleteAuthor, getAllAuthors } from '@/services/authorService';
import { Author, Tag } from '@/services/dto';

const MetaDataForm: React.FC = () => {
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [allAuthors, setAllAuthors] = useState<Author[]>([]);
    const [tagName, setTagName] = useState('');
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [authorName, setAuthorName] = useState('');
    const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetaData = async () => {
            try {
                const tags = await getAllTags();
                const authors = await getAllAuthors();
                setAllTags(tags);
                setAllAuthors(authors);
            } catch (error) {
                console.error('Error fetching metadata:', error);
            }
        };
        fetchMetaData();
    }, []);

    const handleTagSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            if (selectedTagId) {
                await updateTag(selectedTagId, { name: tagName });
                setSuccessMessage('Tag updated successfully!');
            } else {
                const createdTag = await createTag({ name: tagName });
                setSuccessMessage(`Tag "${createdTag.name}" created successfully!`);
            }
            setTagName('');
            setSelectedTagId(null);
            setAllTags(await getAllTags());
        } catch (error) {
            setErrorMessage('An error occurred while processing the tag. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTagDelete = async (id: string) => {
        setLoading(true);
        try {
            await deleteTag(id);
            setSuccessMessage('Tag deleted successfully!');
            setAllTags(await getAllTags());
        } catch (error) {
            setErrorMessage('An error occurred while deleting the tag. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            if (selectedAuthorId) {
                await updateAuthor(selectedAuthorId, { name: authorName });
                setSuccessMessage('Author updated successfully!');
            } else {
                const createdAuthor = await createAuthor({ name: authorName });
                setSuccessMessage(`Author "${createdAuthor.name}" created successfully!`);
            }
            setAuthorName('');
            setSelectedAuthorId(null);
            setAllAuthors(await getAllAuthors());
        } catch (error) {
            setErrorMessage('An error occurred while processing the author. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorDelete = async (id: string) => {
        setLoading(true);
        try {
            await deleteAuthor(id);
            setSuccessMessage('Author deleted successfully!');
            setAllAuthors(await getAllAuthors());
        } catch (error) {
            setErrorMessage('An error occurred while deleting the author. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">Manage Tags and Authors</h1>

            {/* Tags Section */}
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                <form onSubmit={handleTagSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="tagName">Tag Name</Label>
                        <Input
                            id="tagName"
                            type="text"
                            placeholder="Enter tag name"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={loading || !tagName.trim()} className="w-full">
                        {loading ? 'Processing...' : selectedTagId ? 'Update Tag' : 'Create Tag'}
                    </Button>
                </form>

                <ul className="mt-4 space-y-2">
                    {allTags.map((tag) => (
                        <li key={tag.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                            <span>{tag.name}</span>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setTagName(tag.name);
                                        setSelectedTagId(tag.id.toString());
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleTagDelete(tag.id.toString())}>
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Authors Section */}
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Authors</h2>
                <form onSubmit={handleAuthorSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="authorName">Author Name</Label>
                        <Input
                            id="authorName"
                            type="text"
                            placeholder="Enter author name"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={loading || !authorName.trim()} className="w-full">
                        {loading ? 'Processing...' : selectedAuthorId ? 'Update Author' : 'Create Author'}
                    </Button>
                </form>

                <ul className="mt-4 space-y-2">
                    {allAuthors.map((author) => (
                        <li key={author.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                            <span>{author.name}</span>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setAuthorName(author.name);
                                        setSelectedAuthorId(author.id.toString());
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleAuthorDelete(author.id.toString())}>
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Feedback Messages */}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </div>
    );
};

export default MetaDataForm;
