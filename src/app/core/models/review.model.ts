export interface Review {
  _id?: string;
  user: { _id: string; username: string };
  imdbID: string;
  movieTitle: string;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface ReviewPayload {
  imdbID: string;
  movieTitle: string;
  rating: number;
  comment?: string;
}
