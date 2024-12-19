import { createClient, type ClientConfig } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { Image } from "@sanity/types";
const config: ClientConfig = {
  projectId: "xrm8r75b",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
};
export const sanityClient = createClient(config);

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Image) {
  return builder.image(source);
}
