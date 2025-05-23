package com.omar.event_participation_service.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Event Particiaption Service API",
                version = "1.0",
                description = "API documentation for the Event Particiaption Service of the Spotify Clone project.",
                termsOfService = "https://spotify-clone.com/terms",
                contact = @Contact(
                        name = "Omar Drissi",
                        email = "omardrissi06@gmail.com",
                        url = "https://github.com/drissiOmar98"
                ),
                license = @License(
                        name = "Apache 2.0",
                        url = "https://www.apache.org/licenses/LICENSE-2.0"
                )
        ),
        security = @SecurityRequirement(name = "keycloak")
)
@SecurityScheme(
        name = "keycloak",
        type = SecuritySchemeType.OAUTH2,
        bearerFormat = "JWT",
        scheme = "bearer",
        in = SecuritySchemeIn.HEADER,
        flows = @OAuthFlows(
                password = @OAuthFlow(
                        authorizationUrl = "http://localhost:9098/realms/SpotifyClone/protocol/openid-connect/auth",
                        tokenUrl = "http://localhost:9098/realms/SpotifyClone/protocol/openid-connect/token"
                )
        )
)
public class OpenApiConfig {
}
