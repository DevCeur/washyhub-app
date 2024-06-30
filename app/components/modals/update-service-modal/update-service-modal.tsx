import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

import { FiEdit3 } from "react-icons/fi";

import type {
  CarwashServiceWithCarwash,
  CarwashWithOwnerServicesAndPackages,
} from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { Modal } from "~/components/modal";
import { Button } from "~/components/button";
import { Select } from "~/components/select";
import { TextInput } from "~/components/text-input";
import { CurrencyInput } from "~/components/currency-input";
import { TextareaInput } from "~/components/textarea-input";

import { action } from "~/routes/_private+/carwashes/$carwashId/services/_index/route";

import styles from "./update-service-modal.module.css";

interface UpdateServiceModalProps {
  service: CarwashServiceWithCarwash;
  carwashes: CarwashWithOwnerServicesAndPackages[];
}

export const UpdateServiceModal = ({
  service,
  carwashes,
}: UpdateServiceModalProps) => {
  const fetcher = useFetcher<typeof action>();

  const actionData = fetcher.data;

  const errors = actionData?.errors;

  const [isOpen, setIsOpen] = useState(false);

  const [selectedCarwash, setSelectedCarwash] = useState({
    id: service.carwash.id,
    label: service.carwash.name,
  });

  const formAction = `${ROUTE.CARWASHES}/${service.carwash?.id}/services`;

  const isLoading =
    (fetcher.state === "submitting" || fetcher.state === "loading") &&
    fetcher.formAction === formAction;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSetSelectedCarwash = (value: { id: string; label: string }) => {
    setSelectedCarwash(value);
  };

  useEffect(() => {
    if (actionData?.success && !isLoading) {
      setIsOpen(false);
    }
  }, [actionData?.success, isLoading]);

  return (
    <>
      <Button
        icon={FiEdit3}
        size="small"
        hierarchy="tertiary"
        onClick={handleOpen}
      />

      <Modal
        position="right"
        title={`Update Service: ${service.name}`}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <fetcher.Form method="PUT" action={formAction} className={styles.form}>
          <fieldset className={styles.form_fields}>
            <TextInput
              name="service_name"
              label="Service Name"
              placeholder="General Cleaning"
              defaultValue={service.name}
              error={errors?.service_name}
            />

            <TextareaInput
              name="service_description"
              label="Service Description"
              placeholder="Simple exterior and interior Car cleaning"
              defaultValue={service.description || ""}
              error={errors?.service_description}
            />

            <CurrencyInput
              label="Service Cost"
              name="service_cost"
              hint="This is used to calculate packages costs and more"
              placeholder="$50"
              defaultValue={service.cost.toString()}
              error={errors?.service_cost}
            />

            <Select
              label="Carwash"
              hint="This service will be assigned to this carwash"
              selectedOption={selectedCarwash}
              onChange={handleSetSelectedCarwash as () => void}
              options={carwashes.map((carwash) => ({
                id: carwash?.id,
                label: carwash?.name,
              }))}
            />

            <input
              type="hidden"
              name="selected_carwash_id"
              value={selectedCarwash.id}
            />
          </fieldset>

          <div className={styles.buttons_container}>
            <Button
              loading={isLoading}
              type="submit"
              name="service_id"
              value={service.id}
            >
              Update Service
            </Button>

            <Button
              hierarchy="secondary"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </fetcher.Form>
      </Modal>
    </>
  );
};
