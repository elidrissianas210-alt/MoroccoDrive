import { redirect } from "next/navigation";
import { getAgencySetup } from "@/modules/agencies/actions/manage-agency";
import { listVehicles } from "@/modules/agencies/actions/manage-vehicles";
import { listFleetImages } from "@/modules/agencies/actions/manage-images";
import { AgencyPortal } from "@/modules/agencies/components/agency-portal";

export default async function AgencyPage() {
  const setup = await getAgencySetup();
  if (!setup.authenticated || !setup.isAgency) redirect("/agency/login");
  if (!setup.agency) redirect("/agency/onboarding");
  const [vehicles, fleetImages] = await Promise.all([listVehicles(), listFleetImages()]);
  const initialImages = Object.fromEntries(vehicles.map((vehicle) => [vehicle.id, fleetImages[vehicle.id] ?? []] as const));
  return <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1480px]"><AgencyPortal agency={setup.agency} vehicles={vehicles} initialImages={initialImages} /></div></main>;
}
