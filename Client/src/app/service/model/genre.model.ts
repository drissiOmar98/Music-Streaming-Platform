import { IconName } from "@fortawesome/free-solid-svg-icons";

export type GenreName = "ALL" | "POP" | "ROCK" | "JAZZ" | "HIP_HOP" | "ELECTRONIC"
  | "CLASSICAL" | "METAL" | "RNB" | "REGGAE" | "COUNTRY" | "BLUES"
  | "LATIN" | "FOLK" | "SOUL" | "FUNK";

export interface Genre {
  icon: IconName;
  displayName: string;
  technicalName: GenreName;
  activated: boolean;
}
