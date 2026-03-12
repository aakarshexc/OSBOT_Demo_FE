import { Main } from "@/components/layout/main";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import AllClient from "../components/AllClient"; 
import AllUsers from "./AllUsers";


export default function AdminDirectoryPage() {
  return (
    <Main fluid>
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="clients">All clients</TabsTrigger>
          <TabsTrigger value="users">All users</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          {/* Shows the same AllClient page we already built */}
          <AllClient />
        </TabsContent>

        <TabsContent value="users">
          {/* Shows the same AllUsers page with role + client filters */}
          <AllUsers />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
