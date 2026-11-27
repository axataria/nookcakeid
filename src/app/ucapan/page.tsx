import { redirect } from "next/navigation";

export default function UcapanRedirectPage() {
  redirect("/print?tab=ucapan");
}
