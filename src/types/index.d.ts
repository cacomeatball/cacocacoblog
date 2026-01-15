declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

export interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  content: string;
  user_id: string;
  username: string;
  image_url?: string;
}

