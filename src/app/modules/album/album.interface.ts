export type ICreateAlbum = {
  title: string;
  releaseYear: string;
  genre: string;
  artists: {
    artistId: string;
  }[];
};

export type IAlbumFilters = {
  searchTerm?: string | undefined;
  title?: string | undefined;
  releaseYear?: string | undefined;
  genre?: string | undefined;
};
