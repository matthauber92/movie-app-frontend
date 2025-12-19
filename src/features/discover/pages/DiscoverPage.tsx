import { useGetMoviesQuery } from '@store/api/moviesApiSlice';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const getPosterUrl = (path?: string | null) =>
    path ? `${IMAGE_BASE_URL}/w500${path}` : null;

const DiscoverPage = () => {
    const { data, isLoading, isError } = useGetMoviesQuery({
        page: 1
        // genreIds: '28', // optional (Action)
    });

    if (isLoading) {
        return <div>Loading movies…</div>;
    }

    if (isError || !data) {
        return <div>Failed to load movies.</div>;
    }

    return (
        <div className="discover-page">
            <h1>Discover Movies</h1>

            <div className="movie-grid">
                {data.results.map((movie) => {
                    const posterUrl = getPosterUrl(movie.poster_path);

                    return (
                        <div key={movie.id} className="movie-card">
                            {posterUrl && (
                                <img
                                    src={posterUrl}
                                    alt={movie.title}
                                    loading="lazy"
                                />
                            )}

                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                {movie.release_date && (
                                    <span className="year">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DiscoverPage;
