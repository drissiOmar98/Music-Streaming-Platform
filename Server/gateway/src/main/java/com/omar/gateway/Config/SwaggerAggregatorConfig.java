package com.omar.gateway.Config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class SwaggerAggregatorConfig {

    @Value("${music-service.url}")
    private String musicServiceUrl;

    @Value("${artist-service.url}")
    private String artistServiceUrl;

    @Value("${user-service.url}")
    private String userServiceUrl;

    @Value("${favorites-service.url}")
    private String favoritesServiceUrl;

    @Value("${follow-service.url}")
    private String followServiceUrl;

    @Value("${playlist-service.url}")
    private String playlistServiceUrl;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Route for Music Service API Docs
                .route("music-service-api-docs", r -> r.path("/aggregate/music-service/v3/api-docs")
                        .filters(f -> f.rewritePath("/aggregate/music-service/v3/api-docs", "/v3/api-docs"))
                        .uri(musicServiceUrl))

                // Route for Artist Service API Docs
                .route("artist-service-api-docs", r -> r.path("/aggregate/artist-service/v3/api-docs")
                        .filters(f -> f.rewritePath("/aggregate/artist-service/v3/api-docs", "/v3/api-docs"))
                        .uri(artistServiceUrl))

                // Route for User Service API Docs
                .route("user-service-api-docs", r -> r.path("/aggregate/user-service/v3/api-docs")
                        .filters(f -> f.rewritePath("/aggregate/user-service/v3/api-docs", "/v3/api-docs"))
                        .uri(userServiceUrl))

                // Route for Favourite Service API Docs
                .route("favorites-service-api-docs", r -> r.path("/aggregate/favorites-service/v3/api-docs")
                        .filters(f -> f.rewritePath("/aggregate/favorites-service/v3/api-docs", "/v3/api-docs"))
                        .uri(favoritesServiceUrl))

                // Route for Follow Service API Docs
                .route("follow-service-api-docs", r -> r.path("/aggregate/follow-service/v3/api-docs")
                        .filters(f -> f.rewritePath("/aggregate/follow-service/v3/api-docs", "/v3/api-docs"))
                        .uri(followServiceUrl))

                // Route for Playlist Service API Docs
                .route("playlist-service-api-docs", r -> r.path("/aggregate/playlist-service/v3/api-docs")
                        .filters(f -> f.rewritePath("/aggregate/playlist-service/v3/api-docs", "/v3/api-docs"))
                        .uri(playlistServiceUrl))

                .build();
    }
}
