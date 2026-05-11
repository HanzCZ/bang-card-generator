import type { CardParams } from "./types";
import { generateCard, downloadCard } from "./cardGenerator";

export async function fetchPreview(params: CardParams): Promise<string> {
  return generateCard(params, false);
}

export async function exportCard(params: CardParams): Promise<void> {
  return downloadCard(params);
}

export interface SuitData { id: number; src: string; }

export const SUIT_LIST: SuitData[] = [
  { id: 0, src: "./resources/suits/hearts.png" },
  { id: 1, src: "./resources/suits/clubs.png" },
  { id: 2, src: "./resources/suits/diamonds.png" },
  { id: 3, src: "./resources/suits/spades.png" },
];
