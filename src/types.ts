export type CardType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CardSuit = 0 | 1 | 2 | 3;

export const CARD_TYPES = [
  { id: 0 as CardType, label: "Action Card" },
  { id: 1 as CardType, label: "Blue Item" },
  { id: 2 as CardType, label: "Green Item" },
  { id: 3 as CardType, label: "Character – 3 lives" },
  { id: 4 as CardType, label: "Character – 4 lives" },
  { id: 5 as CardType, label: "Character – 5 lives" },
  { id: 6 as CardType, label: "Character – 6 lives" },
];

export const CARD_VALUES = [
  "Random", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A",
];

export interface CardParams {
  card_type: CardType;
  card_value: string;
  card_suit: CardSuit;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  back_card: boolean;
  art: File | null;
  expansion_art: File | null;
}
