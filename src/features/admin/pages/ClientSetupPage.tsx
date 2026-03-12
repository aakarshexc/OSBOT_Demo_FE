import { Main } from "@/components/layout/main";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreateClient } from "../components/CreateClient";
import CreateUser from "../components/CreateUser";

export default function ClientSetupPage() {
  return (
    <Main fluid>
      <Tabs defaultValue="create-client" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="create-client">
            Create client
          </TabsTrigger>
          <TabsTrigger value="create-user">
            Create client user
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create-client">
          {/* existing CreateClient form */}
          <CreateClient />
        </TabsContent>

        <TabsContent value="create-user">
          {/* existing CreateUser form (SUPER_ADMIN view with client dropdown) */}
          <CreateUser />
        </TabsContent>
      </Tabs>
    </Main>
  );
}
