export interface Video {
  id: string;
  title: string;
}

export interface Category {
  id: string;
  name: string;
  videos: Video[];
}