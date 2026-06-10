import { redirect } from "next/navigation";

// The gala landing page is the site for now; send the root there.
export default function Home() {
  redirect("/galas");
}
