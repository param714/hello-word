import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  List,
  InlineStack,
} from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useState } from "react";
import { SettingsIcon, PlusIcon } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { redirectToCheckoutSettings } from "../utils/navigation";
import GoogleMapsApiModal from "../components/GoogleMapsApiModal";
import { updateUser,getUserApiKey } from "../models/UserModel";
export const loader = async ({ request }) => {
const { session } = await authenticate.admin(request);
const apiKey = await getUserApiKey(session);
return json({ apiKey });
};
export const action = async ({ request }) => {
 const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const apiKey = formData.get("apiKey");
  const result = await updateUser(session, apiKey);
  if (result.success) {
    return { success: true };
  } else {
    return { success: false, message: result.message };
  }
};
export default function Index() {
    const [modalActive, setModalActive] = useState(false);
    const toggleModal = () => setModalActive((prev) => !prev);
  const { apiKey } = useLoaderData();
  return (
    <Page
      fullWidth
      title="Setup Guide"
      primaryAction={{
        content: "Add/Edit Google Maps API Key",
        icon: PlusIcon,
          onAction: toggleModal,
        accessibilityLabel: "Add/Edit Google Maps API Key",
      }}
    >
      <TitleBar title="Setup Guide" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Thank you for installing!
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Follow these steps to enable address autocompletion at checkout:
                  </Text>
                </BlockStack>
                <BlockStack gap="200">
                  <List type="number" >
                    <List.Item>Clcik the button below to go Setting {'-->'} <Text as="span" fontWeight="bold">"Checkout"</Text>.</List.Item>
                    <List.Item>user "Configurations", click on the <Text as="span" fontWeight="bold">"Customize"</Text> button.</List.Item>
                    <List.Item>In the checkout editor, click on the <Text as="span" fontWeight="bold">"setting"</Text> icon on the left bar.</List.Item>
                    <List.Item>Scroll all the down; in the <Text as="span" fontWeight="bold">"Address autocompletion section, check the "Use address autocompletion"</Text>.</List.Item>
                    <List.Item>Select <Text as="span" fontWeight="bold">"CompleteIt"</Text>.</List.Item>
                    <List.Item>Click on the <Text as="span" fontWeight="bold">"Edit app settings"</Text> link.</List.Item>
                    <List.Item>Enter your Google Maps API key.</List.Item>
                    <List.Item>Click the <Text as="span" fontWeight="bold">"Save"</Text> button.</List.Item>
                  </List>
                </BlockStack>
                <InlineStack gap="200">
                  <Button icon={SettingsIcon} variant="primary" onClick={redirectToCheckoutSettings}>Go to Settings</Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
         <GoogleMapsApiModal modalActive={modalActive} toggleModal={toggleModal} apiKeyVal={apiKey} />
    </Page>
  );
}
