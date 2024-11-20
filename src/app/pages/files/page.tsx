"use client";
import FileTable from "./table";
import CreateTagForm from "./tagForm";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const AdminPage = () => {


    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            <Tabs defaultValue="account" className="mx-auto">
                <TabsList>
                    <TabsTrigger value="1">Files</TabsTrigger>
                    <TabsTrigger value="2">Tags</TabsTrigger>
                </TabsList>
                <TabsContent value="1"><FileTable /></TabsContent>
                <TabsContent value="2"><CreateTagForm /></TabsContent>
            </Tabs>


        </div>
    );
};

export default AdminPage;
