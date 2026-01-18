export interface IPost {
  createdAt: Date;
  id: string;
  authorHandle: string;
  content: string;
  timestamp: Date;
  mentions: string[];
  hasNipNipHashtag: boolean;
}