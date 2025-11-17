
export interface Article {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  keywords: string[];
  category: string;
  author: string;
  date: string;
  thumbnail: string;
  content: string;
  published: boolean;
}
