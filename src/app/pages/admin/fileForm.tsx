import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast"
import { deleteFile, updateFile } from '@/services/fileService';
import { getAllTags } from '@/services/tagService';
import { getAllAuthors } from '@/services/authorService';
import { File, Author, Tag } from '@/services/dto';

interface UpdateFileFormProps { // ID of the file to update
    fileData: Partial<File>; // Pre-fill form with existing file data
    onUpdateSuccess?: () => void;
}


const UpdateFileForm: React.FC<UpdateFileFormProps> = ({ fileData, onUpdateSuccess }: UpdateFileFormProps) => {
    const [formData, setFormData] = useState<Partial<File>>(fileData);
    const [allTags, setAllTags] = useState<Tag[]>([]); // All available tags
    const [allAuthors, setAllAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const { toast } = useToast(); // Toast for notifications

    useEffect(() => {
        const fetchMetaData = async () => {
            try {
                const tags = await getAllTags();
                const authors = await getAllAuthors();
                setAllTags(tags);
                setAllAuthors(authors);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch tags or authors.",
                    variant: "destructive",
                });
                console.error('Error fetching metadata:', error);
            }
        };

        fetchMetaData();
    }, [toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (selectedTagId: string) => {
        const selectedTag = allTags.find((tag) => tag.id.toString() === selectedTagId);
        if (selectedTag && !formData.tags?.find((tag) => tag.id === selectedTag.id)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...(prev.tags || []), selectedTag],
            }));
        }
    };

    const handleAuthorChange = (selectedAuthorId: string) => {
        const selectedAuthor = allAuthors.find((author) => author.id.toString() === selectedAuthorId);
        if (selectedAuthor && !formData.authors?.find((author) => author.id === selectedAuthor.id)) {
            setFormData((prev) => ({
                ...prev,
                authors: [...(prev.authors || []), selectedAuthor],
            }));
        }
    };

    const removeTag = (tagId: number) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags?.filter((tag) => tag.id !== tagId),
        }));
    };

    const removeAuthor = (authorId: number) => {
        setFormData((prev) => ({
            ...prev,
            authors: prev.authors?.filter((author) => author.id !== authorId),
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedFile = await updateFile(formData);
            toast({
                title: "Success",
                description: `File "${updatedFile.fileName}" updated successfully!`,
            });
            onUpdateSuccess && onUpdateSuccess();
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while updating the file.",
                variant: "destructive",
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    const handleTagDelete = async (id: number) => {
        setLoading(true);
        try {
            await deleteFile(id);
            toast({
                title: "Success",
                description: `File "${id}" Deleted successfully!`,
            });
            setAllTags(await getAllTags());
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while updating the file.",
                variant: "destructive",
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="fileName">File Name</Label>
                    <Input
                        id="fileName"
                        name="fileName"
                        value={formData.fileName || ''}
                        onChange={handleChange}
                        placeholder="Enter file name"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="folderName">Folder Name</Label>
                    <Input
                        id="folderName"
                        name="folderName"
                        value={formData.folderName || ''}
                        onChange={handleChange}
                        placeholder="Enter folder name"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="fileType">File Type</Label>
                    <Input
                        id="fileType"
                        name="fileType"
                        value={formData.fileType || ''}
                        onChange={handleChange}
                        placeholder="Enter file type"
                        required
                    />
                </div>

                <div>
                    <Label>Tags</Label>
                    <Select onValueChange={handleTagChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select tags" />
                        </SelectTrigger>
                        <SelectContent>
                            {allTags.map((tag) => (
                                <SelectItem key={tag.id} value={tag.id.toString()}>
                                    {tag.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags?.map((tag) => (
                            <Badge
                                key={tag.id}
                                className="cursor-pointer"
                                onClick={() => removeTag(tag.id)}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div>
                    <Label>Authors</Label>
                    <Select onValueChange={handleAuthorChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select authors" />
                        </SelectTrigger>
                        <SelectContent>
                            {allAuthors.map((author) => (
                                <SelectItem key={author.id} value={author.id.toString()}>
                                    {author.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.authors?.map((author) => (
                            <Badge
                                key={author.id}
                                className="cursor-pointer"
                                onClick={() => removeAuthor(author.id)}
                            >
                                {author.name}
                            </Badge>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Updating..." : "Update File"}
                </Button>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <Button className="w-full" variant="destructive" type="button">
                            Delete File
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this file? This action cannot be undone.</p>
                        <DialogFooter>
                            <Button variant="secondary"
                                onClick={() =>
                                    setShowDialog(false)
                                }>
                                Cancel
                            </Button>
                            <Button variant="destructive"
                                onClick={() => {
                                    // Add delete logic here
                                    handleTagDelete(formData.id ?? 0);
                                    setShowDialog(false);
                                }}
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>



            </form>
        </div>
    );
};

export default UpdateFileForm;
