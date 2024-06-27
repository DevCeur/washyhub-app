import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

import { FiPlus } from "react-icons/fi";

import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { Modal } from "~/components/modal";
import { Button } from "~/components/button";
import { Select } from "~/components/select";
import { TextInput } from "~/components/text-input";
import { CurrencyInput } from "~/components/currency-input";
import { TextareaInput } from "~/components/textarea-input";

import { action } from "~/routes/_private+/carwashes/$id/services/route";

import styles from "./create-service-modal.module.css";

interface CreateServiceModalProps {
  carwash: CarwashWithOwnerServicesAndPackages;
  variant: "primary" | "secondary";
  currentCarwash: CarwashWithOwnerServicesAndPackages;
  carwashes: CarwashWithOwnerServicesAndPackages[];
}

export const CreateServiceModal = ({
  carwash,
  variant,
  currentCarwash,
  carwashes,
}: CreateServiceModalProps) => {
  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data;

  const errors = actionData?.errors;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCarwash, setSelectedCarwash] = useState({
    id: currentCarwash?.id,
    label: currentCarwash?.name,
  });

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
    if (actionData?.success) {
      setIsOpen(false);
    }
  }, [actionData?.success]);

  return (
    <>
      <Button
        icon={FiPlus}
        hierarchy={variant}
        size={variant === "primary" ? "default" : "small"}
        onClick={handleOpen}
      >
        Create Service
      </Button>

      <Modal
        position="right"
        title="Create new service"
        description="Use this service in your orders or add it to a package"
        isOpen={isOpen}
        onClose={handleClose}
      >
        <fetcher.Form
          method="POST"
          action={`${ROUTE.CARWASHES}/${carwash?.id}/services`}
          className={styles.form}
        >
          <fieldset className={styles.form_fields}>
            <TextInput
              name="service_name"
              label="Service Name"
              placeholder="General Cleaning"
              error={errors?.service_name}
            />

            <TextareaInput
              name="service_description"
              label="Service Description"
              placeholder="Simple exterior and interior Car cleaning"
              error={errors?.service_description}
            />

            <CurrencyInput
              label="Service Cost"
              name="service_cost"
              hint="This is used to calculate packages costs and more"
              placeholder="$50"
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
            <Button>Create Service</Button>

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
