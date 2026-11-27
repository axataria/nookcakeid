import { redirect } from "next/navigation";

export default function AdminUcapanRedirectPage() {
  redirect("/print?tab=ucapan");
}
