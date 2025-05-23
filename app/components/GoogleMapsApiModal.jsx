import {
  Modal,
  FormLayout,
  TextField,
  Toast,
  Frame,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { validateGoogleMapsApiKey } from '../utils/validateGoogleMapsApiKey';
export default function GoogleMapsApiModal({ modalActive,toggleModal,apiKeyVal }) {
  const [apiKey, setApiKey] = useState('');
  const [errors, setErrors] = useState({});
  const [toastActive, setToastActive] = useState(false);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
useEffect(() => {
  if (modalActive) {
    setApiKey(apiKeyVal || '');
     setErrors({});
  }
}, [modalActive, apiKeyVal]);
  const toggleToast = () => setToastActive((active) => !active);
  const toastMarkup = toastActive ? (
    <Toast content="Google Maps API key saved successfully." onDismiss={toggleToast} />
  ) : null;

  // Show toast + reset form when post is successfully added
  useEffect(() => {
    if (fetcher.data?.success) {
      setApiKey("");
      setErrors({});
      toggleModal();
      setToastActive(true);
    }
  }, [fetcher.data]);

  const validateForm = () => {
    const newErrors = {};
    if (!apiKey.trim()) newErrors.apiKey = "Key is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  const isFormValid = validateForm();
  if (!isFormValid) return;

  const isApiKeyValid = await validateGoogleMapsApiKey(apiKey);
  if (!isApiKeyValid) {
    setErrors({ apiKey: "Invalid Google Maps API key" });
    return;
  }
  document.getElementById("add-update-key")?.requestSubmit();
};
  return (
    <Frame>
      <Modal
        open={modalActive}
        onClose={toggleModal}
        title="Enter your Google Maps API Key"
        primaryAction={{
          content: isSubmitting ? "Saving..." : "Save",
          onAction: handleSubmit,
          disabled: isSubmitting,
        }}
        secondaryActions={[{ content: "Cancel", onAction: toggleModal }]}
      >
        <Modal.Section>
          <fetcher.Form method="post" id="add-update-key">
            <FormLayout>
              <TextField
                label="Google Maps API Key"
                value={apiKey}
                 name="apiKey"
                onChange={setApiKey}
                autoComplete="off"
                error={errors.apiKey}
              />
            </FormLayout>
          </fetcher.Form>
        </Modal.Section>
      </Modal>
      {toastMarkup}
    </Frame>
  );
}


