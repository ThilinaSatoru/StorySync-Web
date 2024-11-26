'use client'
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation';
import { Pdf, Author, Tag } from '@/services/dto';
import { PaginatedContent } from '@/app/components/PaginatedComp';



const FileGallery: React.FC<{ files: Pdf[] }> = ({ files }) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedFile, setSelectedFile] = useState<Pdf | null>(null);

    // Extract unique languages and tags
    const languages = Array.from(new Set(files.map(file => file.language).filter(Boolean)));
    const tags = Array.from(new Set(files.flatMap(file => file.tags.map(tag => tag.name))));

    // Filtered and searched admin
    const filteredFiles = useMemo(() => {
        return files.filter(file => {
            const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLanguage = !selectedLanguage || file.language === selectedLanguage;
            const matchesTag = !selectedTag || file.tags.some(tag => tag.name === selectedTag);
            return matchesSearch && matchesLanguage && matchesTag;
        });
    }, [files, searchTerm, selectedLanguage, selectedTag]);


    // Extract filename without extension
    const getFileNameWithoutExtension = (fullFileName: string) => {
        return fullFileName.replace(/\.[^/.]+$/, "");
    };


    const handleCardClick = (file: Pdf) => {
        // Navigate to the target page
        router.push(`/pages/pdf/${encodeURIComponent(file.filePath)}`);
    };


    return (
        <div className="container p-4 mx-auto">
            <div className="flex mb-4 space-x-2">
                <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map(lang => (
                            <SelectItem key={lang} value={lang!}>
                                {lang}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select onValueChange={setSelectedTag} value={selectedTag}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                        {tags.map(tag => (
                            <SelectItem key={tag} value={tag}>
                                {tag}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


            <PaginatedContent<Pdf>
                items={filteredFiles}
                itemsPerPage={10}
                variant="grid"
                gridClass='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                renderItem={(file) => (
                    <>
                        {/*  className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" */}
                        <Card
                            key={file.id}
                            className="flex flex-col h-[400px] hover:shadow-xl transition-all duration-300  ease-in-out hover:scale-100"
                        >
                            <div className="relative h-[330px] w-auto overflow-hidden rounded-md  cursor-pointer" onClick={() => handleCardClick(file)}>
                                <Image
                                    src={file.thumbnail || "/2.jpg"}
                                    alt={file.fileName}
                                    fill
                                    // className="object-cover"
                                    className={cn(
                                        "h-auto w-auto object-cover transition-all hover:scale-105",
                                        "portrait "
                                    )}
                                />
                            </div>
                            <CardHeader className="p-3">
                                <CardTitle className="pb-1">{getFileNameWithoutExtension(file.fileName)}</CardTitle>
                                <CardDescription>
                                    {file.authors.map(author => (
                                        <Badge key={author.id} variant="secondary" className="mr-1 cursor-pointer ">
                                            {author.name}
                                        </Badge>
                                    ))}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-row justify-between p-2 mr-1">
                                <div className="flex flex-wrap gap-1 mb-0">
                                    {file.language && (
                                        <Badge variant="outline">{file.language}</Badge>
                                    )}
                                    {file.tags.map(tag => (
                                        <Badge key={tag.id} className="cursor-pointer ">{tag.name}</Badge>
                                    ))}
                                </div>
                                <div className="text-xs italic text-gray-500 text-muted-foreground">
                                    Added: {new Date(file.createdTime).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            />


        </div>
    );
};

export default FileGallery;